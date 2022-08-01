import request from 'supertest';
import { app } from '../../app';

it('should return a 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/sign-in')
    .send({})
    .expect(400);
});

it('should return a 400 when a email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(400);
});

it('should return a 400 when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);

  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0r.'
    })
    .expect(400);
});

it('should set a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
