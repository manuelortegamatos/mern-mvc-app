export const gateways = {

    verizon: "@vtext.com",
    tmobile: "@tmomail.net",
    att: "@txt.att.net",
    sprint: "@messaging.sprintpcs.com",

};

// centralized mapping object for easy maintenance 

const CARRIER_KEYWORDS ={
    verizon: ["verizon", "visible"],
    tmobile: ["t-mobile","tmobile","mint","metropcs"],
    att: ["at&t", "att", "cricket"],
    sprint: ["sprint", "boost"],
    //add new carriers here easily!
}

export function normalizeCarrier(carrierName){

    if(!carrierName) return "tmobile";
   
    const normalizedName = carrierName.toLowerCase();

    //Iterate over the defined carries to find a match

    for (const key in CARRIER_KEYWORDS){
        //Find if the normalized name includes any keyword for the current carrier.
        if (CARRIER_KEYWORDS[key].some(keyword => normalizedName.includes(keyword))) return key;
        //returns verizon, tmobile, att, or sprint.
    }

    // default fallback if no known carrier is found.
    return "tmobile"; 

}