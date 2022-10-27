import mongoose from 'mongoose';

import { app } from './app';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Auth JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Auth MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Auth connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Auth on port 3000!');
  });
};

startUp();
