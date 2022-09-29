import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mrtickers/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

// Define the tickets micro-service routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => { 
  throw new NotFoundError(); 
});

// Define the tickets micro-service middlewares
app.use(errorHandler);

export { app };
