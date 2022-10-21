import mongoose from 'mongoose';
import { OrderStatus } from '@mrtickers/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

/* List of properties we have to provide when building an order */
interface OrderAttributes {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

/* List of properties an order has */
interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

/* List of properties the model itself contains */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus)
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
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
  return new Order({
    _id: attributes.id,
    status: attributes.status,
    version: attributes.version,
    userId: attributes.userId,
    price: attributes.price
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
