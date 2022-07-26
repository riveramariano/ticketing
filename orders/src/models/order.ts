import mongoose from 'mongoose';
import { OrderStatus } from '@mrtickers/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

/* A type definition for the attributes that a order has. */
interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/* A type definition for the attributes that a order has. */
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
  ticket: TicketDoc;
}

/* Extending the mongoose.Model to add a new method called build. */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, { // Change order data response
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
});

/* Adding version number to tickets */
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

/* Adding a new method to the Order model called build. */
orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
