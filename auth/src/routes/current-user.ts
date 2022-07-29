import express from 'express';

const router = express.Router();

router.get('/api/users/current-user', (_req, res) => {
  res.send('Hi there!');
});

export { router as currentUserRouter };
