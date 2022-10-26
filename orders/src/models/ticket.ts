import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

/* A type definition for the attributes that a ticket has. */
interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

/* A type definition for the attributes that a ticket has. */
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

/* Extending the mongoose.Model to add a new method called build. */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { // Change ticket data response
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
});

/* Adding version number to tickets */
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

/* Adding a new method to the Ticket model called build. */
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};
ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price
  });
};
ticketSchema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
