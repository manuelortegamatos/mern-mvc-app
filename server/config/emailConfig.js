// this file sets up the trasnporter using nodemailer

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//load environment variables (if not already handled by your node setup)
dotenv.config({ path: '../.env' }); 

const transporter = nodemailer.createTransport({
  /* 
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    requireTLS: true,
*/
    // using a service like Gmail

    service: process.env.MAIL_SERVICE || 'gmail',
    auth: {

        //use environment variable sfor sensitve data
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }

});

//optional: Verify the connection (good for debugging)

transporter.verify((error, success) => {

    if(error){
        console.error(" Mail configuration error:", error.message);

    }else {
        console.log("Mail server connection successful.");
    }


});

//Use ES Module syntax to export the transporter 
export default transporter;
