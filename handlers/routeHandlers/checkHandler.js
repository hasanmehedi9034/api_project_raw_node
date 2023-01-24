/*
 * Title: check Handler
 * Description: Handler to handle user related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;
    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
    let successCode = typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;
    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCode && timeoutSeconds) {
        let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
        // lookup the user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = JSON.parse(userData)
                                let userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                            
                                if (userChecks.length < 5) {
                                    let checkId = createRandomString(20)
                                    let checkObject = {
                                        'id': checkId,
                                        'userPhone': userPhone,
                                        'protocol': protocol,
                                        'url': url,
                                        'method': method,
                                        'successCode': successCode,
                                        'timeoutSeconds': timeoutSeconds
                                    }
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if(!err) {
                                            // add check id in the users object
                                            userObject.checks = userChecks
                                            userObject.checks.push(checkId)

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err) => {
                                                if(!err) {
                                                    callback(200, checkObject);
                                                }
                                                else {
                                                    callback(500, {
                                                        'error': 'server side error'
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            callback(500, {
                                                'error': 'there was a problem in server side'
                                            })
                                        }
                                    })
                                }
                                else {
                                    callback(401, {
                                        'error': 'user has already  max check limit'
                                    })
                                }
                            }
                            else {
                                callback(403, {
                                    'message': 'user not founded'
                                })
                            }
                        })
                    }
                    else {
                        callback(403, {
                            'message': 'user not founded'
                        })
                    }
                })
            }
            else {
                callback(403, {
                    'error': 'authentication failed'
                })
            }
        })
    
    }
    else {
        callback(400, {
            'error': 'you have problem in request'
        })
    }
    




};

handler._check.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length >= 20 ? requestProperties.queryStringObject.id :  false;

    if (id) {
        data.read('checks', id, (err, checkData) => {

            if (!err && checkData) {
                let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData))
                    }
                    else {
                        callback(403, {
                            'error': 'authenticatin failed of token'
                        })
                    }
                })
            }
            else {
                callback(500, {
                    'error': 'there was a problem in your server side'
                })
            }
        })
    }
    else {
        callback(404, {
            'error': 'id  not found'
        })
    }
};

handler._check.put = (requestProperties, callback) => {
    
};

handler._check.delete = (requestProperties, callback) => {
    
};

module.exports = handler;