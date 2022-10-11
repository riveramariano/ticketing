import mongoose from 'mongoose';

/* A type definition for the attributes that a ticket has. */
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

/* A type definition for the attributes that a ticket has. */
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

/* Extending the mongoose.Model to add a new method called build. */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
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

/* Adding a new method to the Ticket model called build. */
ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
