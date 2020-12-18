const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const April = { username: 'April', password: 'PassThis' };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe('endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('posts a new user and returns newly registered user data', async () => {
      const res = await request(server).post('/api/auth/register').send(April);
      expect(res.body.id).toBe(1);
      expect(res.body.username).toBe('April');
    });
    it('responds with "username taken" when user attempts to register twice', async () => {
      await request(server).post('/api/auth/register').send(April);
      const res = await request(server).post('/api/auth/register').send(April);
      expect(JSON.stringify(res.body)).toMatch(/username taken/);
    });
  });
  describe('[POST] /api/auth/login', () => {
    it('welcmes the user upon logging in', async () => {
      await request(server).post('/api/auth/register').send(April);
      const res = await request(server).post('/api/auth/login').send(April);      
      expect(JSON.stringify(res.body)).toMatch(/welcome, April/);
    });
    it('prevents logging in without username and password', async () => {
      const res = await request(server).post('/api/auth/login').send();
      expect(JSON.stringify(res.body)).toMatch(/username and password required/);
    });
  });
  describe('[GET] /api/jokes', () => {
    it('prevents access without token', async () => {
     await db('users').insert(April);
     const res = await request(server).get('/api/jokes');
     expect(JSON.stringify(res.body)).toMatch(/token required/);
    });
    it('allows access to dad jokes when authorization header includes valid token', async () => {
      await request(server).post('/api/auth/register').send(April);
      const user = await request(server).post('/api/auth/login').send(April); 
      const res = await request(server).get('/api/jokes').set('Authorization', `${user.body.token}`);
      expect(res.text).toMatch(/Because he had no guts/);
    });
  });
});
