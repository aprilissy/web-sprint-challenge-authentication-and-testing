const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})
beforeEach(async () => {
  await db('users').truncate();
})
afterAll(async () => {
  await db.destroy();
})

describe('endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('', async () => {
      
    })
    it('', async () => {

    })
  })
  describe('[POST] /api/auth/login', () => {
    it('', async () => {
      
    })
    it('', async () => {

    })
  })
  describe('[GET] /api/jokes', () => {
    it('', async () => {
      
    })
    it('', async () => {

    })
  })
})
