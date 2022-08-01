import request from 'supertest';
import { app } from '../../app';

it('should returns a 201 on successful sign-up', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '!!!vAlidPAssw0rd.'
    })
    .expect(201);
});
