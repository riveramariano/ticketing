import mongoose from 'mongoose';

import { app } from './app';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
    console.log("Tickets service connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Tickets service on port 3000!');
  });
};

startUp();
