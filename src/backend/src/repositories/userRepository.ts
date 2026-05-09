import { randomUUID } from 'crypto';

import { query } from '../db';
import type { User, UserRole } from '../types/models';

interface UserRow {
  id: string;
  email: string;
  password_hash?: string;
  name: string;
  phone: string | null;
  user_type: UserRole;
  profile_picture: string | null;
  bio: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  specializations: string | null;
  portfolio_projects: number | string | null;
  rating: number | string | null;
  reviews_count: number | string | null;
  company_name: string | null;
  tax_id: string | null;
}

const baseSelect = `
  SELECT
    u.id,
    u.email,
    u.password_hash,
    u.name,
    u.phone,
    u.user_type,
    u.profile_picture,
    u.bio,
    u.created_at,
    u.updated_at,
    fp.specializations,
    fp.portfolio_projects,
    fp.rating,
    fp.reviews_count,
    op.company_name,
    op.tax_id
  FROM users u
  LEFT JOIN flipper_profiles fp ON fp.user_id = u.id
  LEFT JOIN owner_profiles op ON op.user_id = u.id
`;

const toIso = (value: Date | string): string => new Date(value).toISOString();

const parseSpecializations = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const mapUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  phone: row.phone,
  userType: row.user_type,
  profilePicture: row.profile_picture,
  bio: row.bio,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
  flipperProfile:
    row.user_type === 'FLIPPER'
      ? {
          specializations: parseSpecializations(row.specializations),
          portfolioProjects: Number(row.portfolio_projects ?? 0),
          rating: Number(row.rating ?? 0),
          reviewsCount: Number(row.reviews_count ?? 0),
        }
      : null,
  ownerProfile:
    row.user_type === 'OWNER'
      ? {
          companyName: row.company_name,
          taxId: row.tax_id,
        }
      : null,
});

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string | null;
  userType: UserRole;
  profilePicture?: string | null;
  bio?: string | null;
  specializations?: string[];
  portfolioProjects?: number;
  companyName?: string | null;
  taxId?: string | null;
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const id = randomUUID();

  await query(
    `
      INSERT INTO users (id, email, password_hash, name, phone, user_type, profile_picture, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      id,
      input.email.toLowerCase(),
      input.passwordHash,
      input.name,
      input.phone ?? null,
      input.userType,
      input.profilePicture ?? null,
      input.bio ?? null,
    ],
  );

  if (input.userType === 'FLIPPER') {
    await query(
      `
        INSERT INTO flipper_profiles (user_id, specializations, portfolio_projects)
        VALUES ($1, $2, $3)
      `,
      [id, JSON.stringify(input.specializations ?? []), input.portfolioProjects ?? 0],
    );
  }

  if (input.userType === 'OWNER') {
    await query(
      `
        INSERT INTO owner_profiles (user_id, company_name, tax_id)
        VALUES ($1, $2, $3)
      `,
      [id, input.companyName ?? null, input.taxId ?? null],
    );
  }

  const created = await findUserById(id);
  if (!created) {
    throw new Error('Failed to create user');
  }

  return created;
};

export const findUserByEmailWithPassword = async (
  email: string,
): Promise<(User & { passwordHash: string }) | null> => {
  const result = await query<UserRow>(`${baseSelect} WHERE LOWER(u.email) = LOWER($1) LIMIT 1`, [email]);
  const row = result.rows[0];

  if (!row || !row.password_hash) {
    return null;
  }

  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query<UserRow>(`${baseSelect} WHERE u.id = $1 LIMIT 1`, [id]);
  const row = result.rows[0];
  return row ? mapUser(row) : null;
};

export const updateUser = async (
  id: string,
  input: {
    name?: string;
    phone?: string | null;
    profilePicture?: string | null;
    bio?: string | null;
    specializations?: string[];
    portfolioProjects?: number;
    companyName?: string | null;
    taxId?: string | null;
  },
): Promise<User | null> => {
  const current = await findUserById(id);
  if (!current) {
    return null;
  }

  const userUpdates: string[] = [];
  const userValues: unknown[] = [];

  const addUserUpdate = (column: string, value: unknown): void => {
    userUpdates.push(`${column} = $${userValues.length + 1}`);
    userValues.push(value);
  };

  if (input.name !== undefined) addUserUpdate('name', input.name);
  if (input.phone !== undefined) addUserUpdate('phone', input.phone);
  if (input.profilePicture !== undefined) addUserUpdate('profile_picture', input.profilePicture);
  if (input.bio !== undefined) addUserUpdate('bio', input.bio);

  if (userUpdates.length > 0) {
    userUpdates.push(`updated_at = NOW()`);
    userValues.push(id);
    await query(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userValues.length}`, userValues);
  }

  if (current.userType === 'FLIPPER') {
    const profileUpdates: string[] = [];
    const profileValues: unknown[] = [];

    const addProfileUpdate = (column: string, value: unknown): void => {
      profileUpdates.push(`${column} = $${profileValues.length + 1}`);
      profileValues.push(value);
    };

    if (input.specializations !== undefined) {
      addProfileUpdate('specializations', JSON.stringify(input.specializations));
    }
    if (input.portfolioProjects !== undefined) {
      addProfileUpdate('portfolio_projects', input.portfolioProjects);
    }

    if (profileUpdates.length > 0) {
      profileUpdates.push('updated_at = NOW()');
      profileValues.push(id);
      await query(
        `UPDATE flipper_profiles SET ${profileUpdates.join(', ')} WHERE user_id = $${profileValues.length}`,
        profileValues,
      );
    }
  }

  if (current.userType === 'OWNER') {
    const profileUpdates: string[] = [];
    const profileValues: unknown[] = [];

    const addProfileUpdate = (column: string, value: unknown): void => {
      profileUpdates.push(`${column} = $${profileValues.length + 1}`);
      profileValues.push(value);
    };

    if (input.companyName !== undefined) {
      addProfileUpdate('company_name', input.companyName);
    }
    if (input.taxId !== undefined) {
      addProfileUpdate('tax_id', input.taxId);
    }

    if (profileUpdates.length > 0) {
      profileUpdates.push('updated_at = NOW()');
      profileValues.push(id);
      await query(
        `UPDATE owner_profiles SET ${profileUpdates.join(', ')} WHERE user_id = $${profileValues.length}`,
        profileValues,
      );
    }
  }

  return findUserById(id);
};
