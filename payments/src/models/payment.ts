import mongoose from 'mongoose';
import { OrderStatus } from '@mrtickers/common';

/* List of properties we have to provide when building a payment */
interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

/* List of properties a payment has */
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

/* List of properties the model itself contains */
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attributes: PaymentAttributes): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
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

/* Adding a new method to the Order model called build. */
paymentSchema.statics.build = (attributes: PaymentAttributes) => {
  return new Payment(attributes);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
