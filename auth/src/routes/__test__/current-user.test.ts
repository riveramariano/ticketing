import request from 'supertest';
import { app } from '../../app';

it('should respond with details about the current user', async () => {  
  const cookie = await getCookie();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('should respond with null if not authenticated', async () => {  
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
