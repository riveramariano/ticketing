import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@mrtickers/common';

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

// Define the tickets micro-service routes
// app.use(currentUserRouter);
// app.use(signInRouter);
// app.use(signOutRouter);
// app.use(signUpRouter);

app.all('*', async () => { 
  throw new NotFoundError(); 
});

// Define the tickets micro-service middlewares
app.use(errorHandler);

export { app };
