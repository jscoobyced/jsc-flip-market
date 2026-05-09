import { randomUUID } from 'crypto';

import type { Property, PropertyImage } from '../types/models';
import { query } from '../db';

interface PropertyRow {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number | string | null;
  longitude: number | string | null;
  property_type: string;
  square_footage: number | string | null;
  year_built: number | string | null;
  property_condition: string;
  asking_price: number | string;
  status: 'active' | 'sold' | 'archived';
  created_at: Date | string;
  updated_at: Date | string;
}

interface PropertyImageRow {
  id: string;
  property_id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  created_at: Date | string;
}

interface PropertyFilters {
  page: number;
  limit: number;
  ownerId?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  condition?: string;
  status?: 'active' | 'sold' | 'archived';
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

interface StoredFile {
  originalName: string;
  storedFileName: string;
  mimeType: string;
  relativePath: string;
}

const toIso = (value: Date | string): string => new Date(value).toISOString();

const mapImage = (row: PropertyImageRow): PropertyImage => ({
  id: row.id,
  propertyId: row.property_id,
  fileName: row.file_name,
  filePath: row.file_path,
  mimeType: row.mime_type,
  createdAt: toIso(row.created_at),
});

const mapProperty = (row: PropertyRow, images: PropertyImage[]): Property => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  description: row.description,
  address: row.address,
  city: row.city,
  state: row.state,
  zipCode: row.zip_code,
  latitude: row.latitude === null ? null : Number(row.latitude),
  longitude: row.longitude === null ? null : Number(row.longitude),
  propertyType: row.property_type,
  squareFootage: row.square_footage === null ? null : Number(row.square_footage),
  yearBuilt: row.year_built === null ? null : Number(row.year_built),
  condition: row.property_condition,
  askingPrice: Number(row.asking_price),
  status: row.status,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
  images,
});

const listImagesForProperties = async (propertyIds: string[]): Promise<Map<string, PropertyImage[]>> => {
  const imageMap = new Map<string, PropertyImage[]>();

  if (propertyIds.length === 0) {
    return imageMap;
  }

  const placeholders = propertyIds.map((_, index) => `$${index + 1}`).join(', ');
  const result = await query<PropertyImageRow>(
    `
      SELECT id, property_id, file_name, file_path, mime_type, created_at
      FROM property_images
      WHERE property_id IN (${placeholders})
      ORDER BY created_at ASC
    `,
    propertyIds,
  );

  for (const row of result.rows) {
    const image = mapImage(row);
    const current = imageMap.get(image.propertyId) ?? [];
    current.push(image);
    imageMap.set(image.propertyId, current);
  }

  return imageMap;
};

const buildFilters = (filters: PropertyFilters): { clause: string; values: unknown[] } => {
  const conditions: string[] = [];
  const values: unknown[] = [];

  const add = (condition: string, value: unknown): void => {
    values.push(value);
    conditions.push(condition.replace('?', `$${values.length}`));
  };

  if (filters.ownerId) add('owner_id = ?', filters.ownerId);
  if (filters.city) add('LOWER(city) = LOWER(?)', filters.city);
  if (filters.state) add('LOWER(state) = LOWER(?)', filters.state);
  if (filters.propertyType) add('LOWER(property_type) = LOWER(?)', filters.propertyType);
  if (filters.condition) add('LOWER(property_condition) = LOWER(?)', filters.condition);
  if (filters.status) add('status = ?', filters.status);
  if (filters.minPrice !== undefined) add('asking_price >= ?', filters.minPrice);
  if (filters.maxPrice !== undefined) add('asking_price <= ?', filters.maxPrice);
  if (filters.q) {
    add(
      `(
        title ILIKE '%' || ? || '%'
        OR description ILIKE '%' || ? || '%'
        OR address ILIKE '%' || ? || '%'
        OR city ILIKE '%' || ? || '%'
        OR state ILIKE '%' || ? || '%'
      )`,
      filters.q,
    );
    values.push(filters.q, filters.q, filters.q, filters.q);
    const lastIndex = values.length;
    conditions[conditions.length - 1] = `(
        title ILIKE '%' || $${lastIndex - 4} || '%'
        OR description ILIKE '%' || $${lastIndex - 3} || '%'
        OR address ILIKE '%' || $${lastIndex - 2} || '%'
        OR city ILIKE '%' || $${lastIndex - 1} || '%'
        OR state ILIKE '%' || $${lastIndex} || '%'
      )`;
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};

const fetchProperties = async (
  filters: PropertyFilters,
): Promise<{ items: Property[]; pagination: { page: number; limit: number; total: number } }> => {
  const { clause, values } = buildFilters(filters);
  const countResult = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM properties ${clause}`, values);
  const total = Number(countResult.rows[0]?.count ?? 0);
  const offset = (filters.page - 1) * filters.limit;
  const listResult = await query<PropertyRow>(
    `
      SELECT *
      FROM properties
      ${clause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `,
    [...values, filters.limit, offset],
  );
  const propertyIds = listResult.rows.map((row) => row.id);
  const imageMap = await listImagesForProperties(propertyIds);

  return {
    items: listResult.rows.map((row) => mapProperty(row, imageMap.get(row.id) ?? [])),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
    },
  };
};

export const listProperties = (filters: PropertyFilters) => fetchProperties(filters);
export const searchProperties = (filters: PropertyFilters) => fetchProperties(filters);

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const result = await query<PropertyRow>('SELECT * FROM properties WHERE id = $1 LIMIT 1', [id]);
  const row = result.rows[0];
  if (!row) {
    return null;
  }

  const imageMap = await listImagesForProperties([id]);
  return mapProperty(row, imageMap.get(id) ?? []);
};

export const createProperty = async (
  input: {
    ownerId: string;
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
    propertyType: string;
    squareFootage?: number | null;
    yearBuilt?: number | null;
    condition: string;
    askingPrice: number;
    status?: 'active' | 'sold' | 'archived';
  },
  files: StoredFile[],
): Promise<Property> => {
  const propertyId = randomUUID();
  await query(
    `
      INSERT INTO properties (
        id, owner_id, title, description, address, city, state, zip_code,
        latitude, longitude, property_type, square_footage, year_built,
        property_condition, asking_price, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16
      )
    `,
    [
      propertyId,
      input.ownerId,
      input.title,
      input.description,
      input.address,
      input.city,
      input.state,
      input.zipCode,
      input.latitude ?? null,
      input.longitude ?? null,
      input.propertyType,
      input.squareFootage ?? null,
      input.yearBuilt ?? null,
      input.condition,
      input.askingPrice,
      input.status ?? 'active',
    ],
  );

  for (const file of files) {
    await query(
      `
        INSERT INTO property_images (id, property_id, file_name, file_path, mime_type)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [randomUUID(), propertyId, file.originalName, file.relativePath, file.mimeType],
    );
  }

  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new Error('Failed to create property');
  }

  return property;
};

export const updateProperty = async (
  propertyId: string,
  ownerId: string,
  input: {
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    latitude?: number | null;
    longitude?: number | null;
    propertyType?: string;
    squareFootage?: number | null;
    yearBuilt?: number | null;
    condition?: string;
    askingPrice?: number;
    status?: 'active' | 'sold' | 'archived';
    deleteImageIds?: string[];
  },
  newFiles: StoredFile[],
): Promise<{ property: Property | null; deletedImagePaths: string[] }> => {
  const updates: string[] = [];
  const values: unknown[] = [];

  const addUpdate = (column: string, value: unknown): void => {
    values.push(value);
    updates.push(`${column} = $${values.length}`);
  };

  if (input.title !== undefined) addUpdate('title', input.title);
  if (input.description !== undefined) addUpdate('description', input.description);
  if (input.address !== undefined) addUpdate('address', input.address);
  if (input.city !== undefined) addUpdate('city', input.city);
  if (input.state !== undefined) addUpdate('state', input.state);
  if (input.zipCode !== undefined) addUpdate('zip_code', input.zipCode);
  if (input.latitude !== undefined) addUpdate('latitude', input.latitude);
  if (input.longitude !== undefined) addUpdate('longitude', input.longitude);
  if (input.propertyType !== undefined) addUpdate('property_type', input.propertyType);
  if (input.squareFootage !== undefined) addUpdate('square_footage', input.squareFootage);
  if (input.yearBuilt !== undefined) addUpdate('year_built', input.yearBuilt);
  if (input.condition !== undefined) addUpdate('property_condition', input.condition);
  if (input.askingPrice !== undefined) addUpdate('asking_price', input.askingPrice);
  if (input.status !== undefined) addUpdate('status', input.status);

  if (updates.length > 0) {
    values.push(propertyId, ownerId);
    await query(
      `
        UPDATE properties
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length - 1} AND owner_id = $${values.length}
      `,
      values,
    );
  }

  const deletedImagePaths: string[] = [];
  if (input.deleteImageIds && input.deleteImageIds.length > 0) {
    const placeholders = input.deleteImageIds.map((_, index) => `$${index + 3}`).join(', ');
    const result = await query<{ file_path: string }>(
      `
        DELETE FROM property_images
        WHERE property_id = $1
          AND property_id IN (SELECT id FROM properties WHERE id = $1 AND owner_id = $2)
          AND id IN (${placeholders})
        RETURNING file_path
      `,
      [propertyId, ownerId, ...input.deleteImageIds],
    );
    deletedImagePaths.push(...result.rows.map((row) => row.file_path));
  }

  for (const file of newFiles) {
    await query(
      `
        INSERT INTO property_images (id, property_id, file_name, file_path, mime_type)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [randomUUID(), propertyId, file.originalName, file.relativePath, file.mimeType],
    );
  }

  return {
    property: await getPropertyById(propertyId),
    deletedImagePaths,
  };
};

export const deleteProperty = async (
  propertyId: string,
  ownerId: string,
): Promise<{ deleted: boolean; imagePaths: string[] }> => {
  const property = await getPropertyById(propertyId);
  if (!property || property.ownerId !== ownerId) {
    return { deleted: false, imagePaths: [] };
  }

  await query('DELETE FROM properties WHERE id = $1 AND owner_id = $2', [propertyId, ownerId]);
  return { deleted: true, imagePaths: property.images.map((image) => image.filePath) };
};
