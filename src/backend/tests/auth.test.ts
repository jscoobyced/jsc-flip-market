import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import { setupTestApp } from './helpers/testApp';

describe('auth routes', () => {
  it('registers, logs in, and refreshes tokens', async () => {
    const { app } = await setupTestApp();

    const registerResponse = await request(app).post('/api/auth/register').send({
      email: 'owner@test.com',
      password: 'Password123!',
      name: 'Owner User',
      userType: 'OWNER',
      companyName: 'Test Homes',
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.userType).toBe('OWNER');
    expect(registerResponse.body.tokens.accessToken).toBeTruthy();
    expect(registerResponse.body.user.ownerProfile.companyName).toBe('Test Homes');

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'owner@test.com',
      password: 'Password123!',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.email).toBe('owner@test.com');

    const refreshResponse = await request(app).post('/api/auth/refresh-token').send({
      refreshToken: loginResponse.body.tokens.refreshToken,
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.tokens.accessToken).toBeTruthy();
    expect(refreshResponse.body.tokens.refreshToken).toBeTruthy();
  });
});
