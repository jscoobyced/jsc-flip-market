import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import { setupTestApp } from './helpers/testApp';

const register = async (
  app: Parameters<typeof request>[0],
  user: { email: string; name: string; userType: 'OWNER' | 'FLIPPER' },
) => {
  const response = await request(app).post('/api/auth/register').send({
    ...user,
    password: 'Password123!',
    companyName: user.userType === 'OWNER' ? 'Owner Co' : undefined,
    specializations: user.userType === 'FLIPPER' ? ['commercial'] : undefined,
  });

  return response.body;
};

describe('enquiry routes', () => {
  it('creates enquiries and scopes owner enquiry reads to related users', async () => {
    const { app } = await setupTestApp();
    const owner = await register(app, { email: 'owner@test.com', name: 'Owner', userType: 'OWNER' });
    const otherOwner = await register(app, { email: 'owner2@test.com', name: 'Other Owner', userType: 'OWNER' });
    const flipper = await register(app, { email: 'flip@test.com', name: 'Flipper', userType: 'FLIPPER' });
    const outsider = await register(app, { email: 'outsider@test.com', name: 'Other', userType: 'FLIPPER' });

    const propertyResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${owner.tokens.accessToken}`)
      .send({
        title: 'Investor Special',
        description: 'Corner lot property needing structural work and interior updates.',
        address: '77 Cedar Ave',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        propertyType: 'single-family',
        condition: 'poor',
        askingPrice: 125000,
      });

    const enquiryResponse = await request(app)
      .post('/api/enquiries')
      .set('Authorization', `Bearer ${flipper.tokens.accessToken}`)
      .send({
        propertyId: propertyResponse.body.property.id,
        message: 'I would like to discuss rehab scope, timelines, and an indicative cash offer.',
        contactName: 'Flipper',
        contactEmail: 'flip@test.com',
        contactPhone: '555-111-2222',
      });

    expect(enquiryResponse.status).toBe(201);
    expect(enquiryResponse.body.email.delivered).toBe(false);
    expect(enquiryResponse.body.email.mode).toBe('disabled');

    const enquiryId = enquiryResponse.body.enquiry.id as string;

    const ownerFetch = await request(app)
      .get(`/api/enquiries/${enquiryId}`)
      .set('Authorization', `Bearer ${owner.tokens.accessToken}`);
    expect(ownerFetch.status).toBe(200);

    const propertyEnquiries = await request(app)
      .get(`/api/enquiries/property/${propertyResponse.body.property.id}`)
      .set('Authorization', `Bearer ${owner.tokens.accessToken}`);
    expect(propertyEnquiries.status).toBe(200);
    expect(propertyEnquiries.body.enquiries).toHaveLength(1);

    const ownerEnquiries = await request(app)
      .get(`/api/enquiries/owner/${owner.user.id}`)
      .set('Authorization', `Bearer ${owner.tokens.accessToken}`);
    expect(ownerEnquiries.status).toBe(200);
    expect(ownerEnquiries.body.enquiries).toHaveLength(1);
    expect(ownerEnquiries.body.enquiries[0].propertyId).toBe(propertyResponse.body.property.id);

    const forbiddenOwnerRead = await request(app)
      .get(`/api/enquiries/owner/${owner.user.id}`)
      .set('Authorization', `Bearer ${otherOwner.tokens.accessToken}`);
    expect(forbiddenOwnerRead.status).toBe(403);

    const outsiderFetch = await request(app)
      .get(`/api/enquiries/${enquiryId}`)
      .set('Authorization', `Bearer ${outsider.tokens.accessToken}`);
    expect(outsiderFetch.status).toBe(403);
  });
});
