const request = require('supertest');
const app = require('../server/server');

it('GET /reviews returns status code of 200', async () => {
  const response = await request(app).get('/reviews');
  expect(response.statusCode).toBe(200);
});
