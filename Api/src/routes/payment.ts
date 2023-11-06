import express from 'express';
import { postPay, getPaymentInformation } from '../controllers/controller';

const router = express.Router();

router.post('/confirmation/:email', postPay);

router.get('/information/:email', getPaymentInformation);

export default router;