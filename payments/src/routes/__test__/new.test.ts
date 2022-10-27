import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({ 
      token: '1234',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({ 
      token: '1234',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: '1234',
      orderId: order.id,
    })
    .expect(400);
});

/*
it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId,
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);
  
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
*/
