import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Backend Foundation (BE-01)', () => {
  it('should initialize the Express app without errors', () => {
    expect(app).toBeDefined();
  });

  it('should expose GET /api/health and return valid response structure', async () => {
    const res = await request(app).get('/api/health');

    // Health route will return 200 if DB is connected or 503 if disconnected
    expect([200, 503]).toContain(res.status);
    expect(res.headers['content-type']).toMatch(/json/);

    if (res.status === 200) {
      expect(res.body).toEqual({
        data: {
          status: 'ok',
          db: 'connected'
        }
      });
    } else {
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data).toHaveProperty('db');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code');
      expect(res.body.error).toHaveProperty('message');
    }
  });

  it('should return 404 for unknown routes matching standard error format', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found: GET /api/unknown-endpoint'
      }
    });
  });

  it('should set security headers via Helmet', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers).toHaveProperty('x-frame-options');
  });
});
