import fs from 'fs';
import path from 'path';

import { query } from '../db';
import { createUser } from '../repositories/userRepository';
import { createProperty, listProperties } from '../repositories/propertyRepository';
import { migrateDatabase } from '../db/migrate';
import { hashPassword } from '../utils/password';
import type { User } from '../types/models';

const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query<{
    id: string;
    email: string;
    name: string;
    phone: string | null;
    user_type: string;
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
  }>(
    `SELECT u.id, u.email, u.name, u.phone, u.user_type, u.profile_picture, u.bio, u.created_at, u.updated_at, fp.specializations, fp.portfolio_projects, fp.rating, fp.reviews_count, op.company_name, op.tax_id
       FROM users u
       LEFT JOIN flipper_profiles fp ON fp.user_id = u.id
       LEFT JOIN owner_profiles op ON op.user_id = u.id
       WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
    [email],
  );
  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    userType: row.user_type as 'OWNER' | 'FLIPPER',
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
  };
};

const toIso = (value: Date | string): string => new Date(value).toISOString();

const parseSpecializations = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const run = async (): Promise<void> => {
  await migrateDatabase();

  const uploadPath = path.resolve(__dirname, '../../storage/uploads');
  fs.mkdirSync(uploadPath, { recursive: true });

  // Create placeholder images for properties (property-1-image-1.jpg, property-1-image-2.jpg, etc.)
  const propertyImages: {
    originalName: string;
    storedFileName: string;
    mimeType: string;
    relativePath: string;
  }[] = [];

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      const imagePath = path.join(uploadPath, `property-${i}-image-${j}.jpg`);
      // Create a simple placeholder image (1x1 pixel JPEG)
      fs.writeFileSync(imagePath, Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!', 'binary'));
      propertyImages.push({
        originalName: `property-${i}-image-${j}.jpg`,
        storedFileName: `property-${i}-image-${j}.jpg`,
        mimeType: 'image/jpeg',
        relativePath: path.relative(uploadPath, imagePath),
      });
    }
  }

  const ownerEmail = 'owner@example.com';
  const flipperEmail = 'flipper@example.com';

  let owner = await findUserByEmail(ownerEmail);
  if (!owner) {
    const created = await createUser({
      email: ownerEmail,
      passwordHash: await hashPassword('Password123!'),
      name: 'Sample Owner',
      userType: 'OWNER',
      companyName: 'Fixer Homes LLC',
      taxId: 'TAX-12345',
    });
    owner = { ...created, passwordHash: '' } as User;
  }

  let flipper = await findUserByEmail(flipperEmail);
  if (!flipper) {
    const created = await createUser({
      email: flipperEmail,
      passwordHash: await hashPassword('Password123!'),
      name: 'Sample Flipper',
      userType: 'FLIPPER',
      specializations: ['single-family', 'multi-family'],
      portfolioProjects: 12,
    });
    flipper = { ...created, passwordHash: '' } as User;
  }

   // Delete old properties from this owner to start fresh
  const oldProperties = await listProperties({ page: 1, limit: 100, ownerId: owner.id });
  for (const prop of oldProperties.items) {
    await query('DELETE FROM property_images WHERE property_id = $1', [prop.id]);
    await query('DELETE FROM properties WHERE id = $1 AND owner_id = $2', [prop.id, owner.id]);
  }

  const existingCount = 0;
  const needToCreate = 3 - existingCount;

  console.log(`Creating ${needToCreate} properties with 3 images each`);
  for (let i = 1; i <= 3; i++) {
    const propertyImagesForThisProperty = propertyImages.slice((i - 1) * 3, i * 3);
    await createProperty(
      {
        ownerId: owner.id,
        title: `Property ${i} - ${['Single-family', 'Multi-family', 'Commercial'][i - 1]}`,
        description: `A ${['single-family home', 'multi-family duplex', 'commercial property'][i - 1]} with great investment potential in a prime location.`,
        address: `123 Market Street ${i}`,
        city: 'Austin',
        state: 'TX',
        zipCode: `7870${i}`,
        propertyType: ['single-family', 'multi-family', 'commercial'][i - 1] as 'single-family' | 'multi-family' | 'commercial' | 'land',
        condition: ['needs-work', 'fair', 'good', 'poor'][i % 4] as 'poor' | 'fair' | 'needs-work' | 'good',
        askingPrice: 245000 + i * 100000,
        squareFootage: 2400 + i * 500,
        yearBuilt: 1978 + i,
        latitude: 30.2672 + i * 0.001,
        longitude: -97.7431 + i * 0.001,
      },
      propertyImagesForThisProperty,
    );
  }

  console.log('Seed complete. Sample accounts:');
  console.log(`- Owner: ${ownerEmail} / Password123!`);
  console.log(`- Flipper: ${flipperEmail} / Password123!`);
  console.log(`- 3 properties with 3 images each in ${uploadPath}`);
};

run().catch((error) => {
  console.error('Seed failed.', error);
  process.exit(1);
});
