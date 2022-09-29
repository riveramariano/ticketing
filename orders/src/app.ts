import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mrtickers/common';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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

// Define the orders micro-service routes
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async () => { 
  throw new NotFoundError(); 
});

// Define the orders micro-service middlewares
app.use(errorHandler);

export { app };
