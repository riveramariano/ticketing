import express from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';

const app = express();
app.use(json());

// Auth service routes
app.use(currentUserRouter);

app.listen(3000, () => {
  console.log('Auth service on port 3000!');
});
