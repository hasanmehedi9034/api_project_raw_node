/*
 * Title: utilities
 * Description: Handle all type of function related things
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/20/2020
 *
 */

// dependencies
const crypto = require('crypto');


// module scaffolding
const utilities = {};


// parse JSON string to object
utilities.parseJSON = (json_string) => {
    let output;

    try {
        output = JSON.parse(json_string);
    }
    catch {
        output = {};
    }
    return output;
}


// hsash stirng
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        let hashed_password = crypto
            .createHmac('sha256', 'password')
            .update(str)
            .digest('hex')
        
        return hashed_password;
    }
    else {
        return false;
    }
}

// create random string
utilities.createRandomString = (strLength) => {
    let length = strLength;

    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';

        for (let i = 1; i <= length; i++) {
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            output += randomChar;
        }
        return output;
    }
    else {
        return false;
    }
    
}


// export module
module.exports = utilities;