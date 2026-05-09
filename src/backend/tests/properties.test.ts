import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import { setupTestApp } from './helpers/testApp';

const registerOwner = async (app: Parameters<typeof request>[0], email: string) => {
  const response = await request(app).post('/api/auth/register').send({
    email,
    password: 'Password123!',
    name: 'Owner',
    userType: 'OWNER',
  });

  return response.body.tokens.accessToken as string;
};

const registerFlipper = async (app: Parameters<typeof request>[0], email: string) => {
  const response = await request(app).post('/api/auth/register').send({
    email,
    password: 'Password123!',
    name: 'Flipper',
    userType: 'FLIPPER',
    specializations: ['single-family'],
  });

  return response.body.tokens.accessToken as string;
};

describe('property routes', () => {
  it('creates, filters, and protects owner-only property mutations', async () => {
    const { app } = await setupTestApp();
    const ownerToken = await registerOwner(app, 'owner-one@test.com');
    const otherOwnerToken = await registerOwner(app, 'owner-two@test.com');
    const flipperToken = await registerFlipper(app, 'flip@test.com');

    const createResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Fixer Upper',
        description: 'Spacious home requiring a full cosmetic renovation with strong ARV potential.',
        address: '111 Pine Street',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75001',
        propertyType: 'single-family',
        condition: 'needs-work',
        askingPrice: 180000,
        squareFootage: 1800,
        yearBuilt: 1984,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.property.title).toBe('Fixer Upper');

    const propertyId = createResponse.body.property.id as string;
    const ownerId = createResponse.body.property.ownerId as string;

    const listResponse = await request(app).get('/api/properties').query({ city: 'Dallas', page: 1, limit: 10 });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items).toHaveLength(1);

    const searchResponse = await request(app).get('/api/properties/search').query({ q: 'cosmetic', page: 1, limit: 10 });
    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.items[0].id).toBe(propertyId);

    const ownerListingsResponse = await request(app).get(`/api/properties/${ownerId}/owner-listings`);
    expect(ownerListingsResponse.status).toBe(200);
    expect(ownerListingsResponse.body.items[0].id).toBe(propertyId);

    const forbiddenForFlipper = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${flipperToken}`)
      .send({
        title: 'Should Fail',
        description: 'Flippers should not create listings on the owner route.',
        address: '1 Fail Road',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75002',
        propertyType: 'single-family',
        condition: 'poor',
        askingPrice: 100000,
      });
    expect(forbiddenForFlipper.status).toBe(403);

    const forbiddenUpdate = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${otherOwnerToken}`)
      .send({ title: 'Not Allowed' });
    expect(forbiddenUpdate.status).toBe(403);

    const updateResponse = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'sold' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.property.status).toBe('sold');

    const deleteResponse = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(deleteResponse.status).toBe(204);
  });
});
