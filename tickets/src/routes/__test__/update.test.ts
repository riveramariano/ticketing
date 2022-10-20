import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

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

it('publishes an event', async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.getCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Concert', price: '20' });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Shopping', price: '30' })
    .expect(400);
});
