/*
 * Title: Token Handler
 * Description: token Handler to handle user related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */

// dependencies
const data = require('../../lib/data')
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities')


// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    }
    else {
        callback(405);
    }

};

handler._token = {};


handler._token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone :  false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password :  false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password)

            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);

                let expires = Date.now() + (60 * 60 * 1000);

                let tokenObject = {
                    phone,
                    'id': tokenId,
                    expires,
                };

                // store the token
                data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, userData);
                    }
                    else {
                        callback(500, {
                            'error': 'token!, sever side error'
                        })
                    }
                })
            }   
            else {
                callback(400, {
                    'message': 'password is not vaild'
                })
            }
        })
    }
    else {
        callback(400, {
            'error': 'you have problem your request'
        })
    }
}


handler._token.get = (requestProperties, callback) => {
    
    // check the token id number is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length >= 20 ? requestProperties.queryStringObject.id :  false;
    if(id) {
        // find the token
        data.read('tokens', id, (err, tokenData) => {
            tokenData = parseJSON(tokenData)
            // console.log(tokenData, 'token data')

            if (!err && tokenData) {
                callback(200, tokenData)
            }
            else {
                callback(404, {
                    'error':  'user token not founded'
                })
            }
        })
    }
    else {
        callback(404, {
            'message': 'token not found'
        })
    }
}


handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length >= 20 ? requestProperties.body.id :  false;
    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend == true ? true : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {

            let tokenObject = parseJSON(tokenData);
            console.log(tokenObject)

            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + (60 * 60 * 1000);
                // store the updated token
                data.update('tokens', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    }
                    else {
                        callback(500, {
                            'error': 'server side error, token updated fail'
                        })
                    }
                })
            }
            else {
                callback(404, {
                    'error': 'token already expired'
                })
            }
        })
    }
    else {
        callback(400, {
            'error': 'Requested token was not found'
        })
    }
}


handler._token.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length >= 20 ? requestProperties.queryStringObject.id :  false;

    if (id) {
        // find phone or user
        data.read('tokens', id, (err, userData) => {
            if (!err && userData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            'message': 'token was deleted successfully'
                        })
                    }
                    else {
                        callback(400, {
                            'message': 'user token not found'
                        })
                    }
                }) 
            }
            else {
                callback(400, {
                    'error': 'user token not founded'
                })
            }
        })
    }
    else {
        callback(400, {
            'error': 'user token not founded'
        })
    }
}



module.exports = handler;