import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful sign-up', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);
});

it('should return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(400);
});

it('should return a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlid',
    })
    .expect(400);
});

it('should return a 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({})
    .expect(400);
});

it('should disallow duplicate emails', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);
  
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(400);
});

it('should set a cookie after successful sign-up', async () => {
  const response = await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
