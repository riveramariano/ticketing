import mongoose from 'mongoose';
import { app } from './app';
import { natsWrrapper } from './nats-wrapper';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrrapper.connect('ticketing', 'askdjna', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Tickets service connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Tickets service on port 3000!');
  });
};

startUp();
