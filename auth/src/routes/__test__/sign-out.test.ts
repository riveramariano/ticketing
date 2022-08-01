import request from 'supertest';
import { app } from '../../app';

it('should clean the cookie after sign-out', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/sign-out')
    .send({})
    .expect(200);
  
  expect(response.get('Set-Cookie')).toBeDefined();
});