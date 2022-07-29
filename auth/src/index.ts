import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

// Define the auth micro-service routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Define the auth micro-service middlewares
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Auth service on port 3000!');
});
