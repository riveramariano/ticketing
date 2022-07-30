import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

// Define the auth micro-service routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => { 
  throw new NotFoundError(); 
});

// Define the auth micro-service middlewares
app.use(errorHandler);

const startUp = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Auth service connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Auth service on port 3000!');
  });
};

startUp();
