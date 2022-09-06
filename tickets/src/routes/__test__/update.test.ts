import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({ title: 'Concert', price: '9.99' })
    .expect(404);
});

it('ruturns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Concert', price: '9.99' })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title: 'Concert', price: '9.99' });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getCookie())
    .send({ title: 'Shopping', price: '5.55' })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Concert', price: '9.99' });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Concert', price: -10 })
    .expect(400);
});

it('updates the ticket if provided valid inputs', async () => {
  const cookie = global.getCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Concert', price: '20' });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Shopping', price: '30' })
    .expect(200);
});
