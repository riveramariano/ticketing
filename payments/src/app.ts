import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mrtickers/common';
import { createChargeRouter } from './routes/new';

const app = express();

app.set('trust proxy', true);
app.use(json());

// This is a middleware that is used to store the JWT in the cookie
app.use(
  cookieSession({
    signed: false, // Disable Encryption
    secure: process.env.NODE_ENV !== 'test', // Require HTTPS
  })
);

// Checks if the user is auth
app.use(currentUser);

// Define the payments micro-service routes
app.use(createChargeRouter);

app.all('*', async () => { 
  throw new NotFoundError(); 
});

// Define the payments micro-service middlewares
app.use(errorHandler);

export { app };
