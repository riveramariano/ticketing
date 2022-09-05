import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
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

});

it('returns 400 if the user provides an invalid title or price', async () => {

});

it('updates the ticket if provided valid inputs', async () => {

});
