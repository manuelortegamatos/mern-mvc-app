import {gateways,normalizeCarrier} from '../config/carrierGateways.js';
import detectCarrier from '../middleware/carrierMiddleware.js';
import transporter from '../config/emailConfig.js';
import {setTimeout as delay } from 'timers/promises';


const sendSms = async (phoneNumber, message) => {
    // Note: If detectCarrier is asynchronous, it must be awaited.
    const { carrier, source } = await detectCarrier(phoneNumber);
    const normalized = normalizeCarrier(carrier);
    const gateway = gateways[normalized];
    // Remove all non-digit characters from the phone number
    const smsAddress = `${phoneNumber.replace(/\D/g,"")}${gateway}`;

    console.log(`sending to ${phoneNumber} via ${carrier} (${source}): ${smsAddress}`);

    await transporter.sendMail({
        from: transporter.options.auth.user,
        to: smsAddress,
        subject: "", // Subject is usually ignored for SMS gateways
        text: message, // Use the passed message
    });

    console.log("SMS sent successfully!");
};

/**
 * Sends a batch of SMS messages to a list of phone numbers.
 * @param {string[]} phoneNumbers - An array of phone numbers to send to.
 * @param {string} message - The message to send to all numbers.
 */
const sendBatchSms = async (phoneNumbers, message) => {
    // Check if phoneNumbers is an array before iterating
    if (!Array.isArray(phoneNumbers)) {
        console.error("sendBatchSms requires an array of phone numbers.");
        return;
    }
    
    for (const phone of phoneNumbers) {
        try {
            // Updated call to match the new sendSms signature
            await sendSms(phone, message); 
            
            // Wait to avoid rate limiting from the email service or carrier
            await delay(1000); 
            
        } catch (err) {
            console.error(`Failed for ${phone}: ${err.message}`);
        }
    }
    console.log("Batch SMS sending complete.");
};

export {sendSms,sendBatchSms};


// Example Usage (assuming you have a list of numbers):
// const testNumbers = ["1234567890", "9876543210"];
// sendBatchSms(testNumbers, "Hello! This is a batch test SMS from modular Node.js script.");