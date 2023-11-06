import express from 'express';
import { testFunction, getToken, dummyTestLock, testBD} from '../controllers/test.controller';


const router = express.Router();

router.get('/testRoute', testFunction);

router.get('/testGetToken/:email', getToken);

router.get('/testLock', dummyTestLock);

router.post('/testDB', testBD);

export default router;