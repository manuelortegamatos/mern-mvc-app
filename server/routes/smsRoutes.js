import express from 'express';
import {sendSingleSms, sendBulkSms} from '../controllers/userController.js';

const router = express.Router();
/*
POST / api / single
Sends a single SMS message.
Expected body: { "phoneNumber": "1234567890", "message": "your text here" }
*/ 
router.post('/single', sendSingleSms);

/*
POST / api / sms / batch 
Sends the same message to a list of numbers.
expected body: { phoneNumbers: ["1234567890","9876543210"], "message": "Bulk message"  }
*/

router.post('/batch', sendBulkSms);

export default router;