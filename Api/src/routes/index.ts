import express from 'express';
import test from './test';
import payment from './payment';

const router = express.Router();

router.use('/test', test);

router.use('/payment', payment);

export default router;