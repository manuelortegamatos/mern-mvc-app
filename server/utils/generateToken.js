const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign( 
        {id}, 
        process.env.JWT_SECRET, // IMPORTANT: your secret key
        {expiresIn: '30d' }// config: it expires after 30 days 
    );
    
};

module.exports = generateToken;