import { randomUUID } from 'crypto';

import { query } from '../db';
import type { Enquiry } from '../types/models';

interface EnquiryRow {
  id: string;
  property_id: string;
  flipper_id: string;
  property_owner_id: string;
  property_title: string;
  flipper_name: string;
  flipper_email: string;
  message: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: 'pending' | 'contacted' | 'accepted' | 'rejected';
  email_delivery_status: string;
  email_delivery_details: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

const baseSelect = `
  SELECT
    e.id,
    e.property_id,
    e.flipper_id,
    p.owner_id AS property_owner_id,
    p.title AS property_title,
    u.name AS flipper_name,
    u.email AS flipper_email,
    e.message,
    e.contact_name,
    e.contact_email,
    e.contact_phone,
    e.status,
    e.email_delivery_status,
    e.email_delivery_details,
    e.created_at,
    e.updated_at
  FROM enquiries e
  INNER JOIN properties p ON p.id = e.property_id
  INNER JOIN users u ON u.id = e.flipper_id
`;

const toIso = (value: Date | string): string => new Date(value).toISOString();

const mapEnquiry = (row: EnquiryRow): Enquiry => ({
  id: row.id,
  propertyId: row.property_id,
  propertyOwnerId: row.property_owner_id,
  propertyTitle: row.property_title,
  flipperId: row.flipper_id,
  flipperName: row.flipper_name,
  flipperEmail: row.flipper_email,
  message: row.message,
  contactName: row.contact_name,
  contactEmail: row.contact_email,
  contactPhone: row.contact_phone,
  status: row.status,
  emailDeliveryStatus: row.email_delivery_status,
  emailDeliveryDetails: row.email_delivery_details,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

export const createEnquiry = async (input: {
  propertyId: string;
  flipperId: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  emailDeliveryStatus: string;
  emailDeliveryDetails?: string | null;
}): Promise<Enquiry> => {
  const id = randomUUID();

  await query(
    `
      INSERT INTO enquiries (
        id, property_id, flipper_id, message, contact_name, contact_email, contact_phone,
        email_delivery_status, email_delivery_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      id,
      input.propertyId,
      input.flipperId,
      input.message,
      input.contactName,
      input.contactEmail,
      input.contactPhone ?? null,
      input.emailDeliveryStatus,
      input.emailDeliveryDetails ?? null,
    ],
  );

  const created = await getEnquiryById(id);
  if (!created) {
    throw new Error('Failed to create enquiry');
  }

  return created;
};

export const getEnquiryById = async (id: string): Promise<Enquiry | null> => {
  const result = await query<EnquiryRow>(`${baseSelect} WHERE e.id = $1 LIMIT 1`, [id]);
  const row = result.rows[0];
  return row ? mapEnquiry(row) : null;
};

export const listEnquiriesByPropertyId = async (propertyId: string): Promise<Enquiry[]> => {
  const result = await query<EnquiryRow>(
    `${baseSelect} WHERE e.property_id = $1 ORDER BY e.created_at DESC`,
    [propertyId],
  );
  return result.rows.map(mapEnquiry);
};

export const listEnquiriesByOwnerId = async (ownerId: string): Promise<Enquiry[]> => {
  const result = await query<EnquiryRow>(
    `${baseSelect} WHERE p.owner_id = $1 ORDER BY e.created_at DESC`,
    [ownerId],
  );
  return result.rows.map(mapEnquiry);
};
