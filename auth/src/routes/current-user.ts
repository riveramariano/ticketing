import express from 'express';
import { currentUser } from '@mrtickers/common';

const router = express.Router();

router.get('/api/users/current-user', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
