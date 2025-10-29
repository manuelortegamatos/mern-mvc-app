import fetch from "node-fetch";
import PhoneNumberUtil from "google-libphonenumber";
import dotenv from "dotenv";

const phoneUtil = PhoneNumberUtil.PhoneNumberUtil.getInstance;

dotenv.config({ path: '../.env' }); 

const DEFAULT_CARRIER_KEY = "tmobile";

async function detectCarrier(phoneNumber){
    let num;
    try{
         num = phoneUtil.parse(phoneNumber, "US");

        if(!phoneUtil.isValidNumber(num)) throw new Error("Phone number failed E.164 validation.") ;

    } catch(error){
        console.error(`Validation Error for ${phoneNumber}:`, error.message);
        return {carrier: DEFAULT_CARRIER_KEY, source: "Fallback - Invalid format"};
    }

    try {
        const url =`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_KEY}&number=${phoneNumber}`;

        const res = await fetch(url);
        //check if the HTTP response itself was successful (status 200)
        if(!res.ok){
            console.error(`Numverify HTTP Error: ${res.status} ${res.statusText}`);
            throw new Error("API service unavailable or returned non-200 status.");
        }
        const data = await res.json();
        // CHECK API SUCCESS / FAILURE FIELD
        if(data.success === false){
            console.error("Numverify API Error:",data.error.info);
            throw new Error(`API returned failure: ${data.error.info}`);
        }
        if(data.carrier) {
            return { 
                carrier: data.carrier.toLowerCase(), 
                source: "Numverify"
             };
        }
    }catch(error){

        // Log any API or network errors
        console.error(`Numverify API failed for ${phoneNumber}:`, error.message);
        //Do not cras the application, proceed to final fallback.
    }
    //final default fallback
    //if local validation passed but API failed/ found no carrier.
    return { 
        carrier: DEFAULT_CARRIER_KEY, 
        source: "Fallback - API failed or no carrier found" 
    };
}

export default detectCarrier;

