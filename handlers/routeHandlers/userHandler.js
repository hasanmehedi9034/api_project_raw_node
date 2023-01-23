/*
 * Title: user Handler
 * Description: route Handler to handle user related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */

// dependencies
const data = require('../../lib/data')
const environments = require('../../helpers/environments')
const { hash, parseJSON } = require('../../helpers/utilities')


// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    }
    else {
        callback(405);
    }

};

handler._user = {};


handler._user.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName :  false;
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone :  false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password :  false;
    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' ? requestProperties.body.tosAgreement :  false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already have
        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName, 
                    lastName, 
                    phone, 
                    password: hash(password),
                    tosAgreement
                }

                // store the user to db
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            'message': 'user was created successfully!'
                        })
                    }
                    else {
                        callback(500, {
                            'error': 'could not create user'
                        })
                    }
                })
            }
            else {
                callback(500, {
                    'error': 'server side error',
                })
            }
        })
    }
    else {
        let userObject = {
            firstName, 
            lastName, 
            phone, 
            password: hash(password),
            tosAgreement
        }
        callback(400, {
            error: 'you have a problem in your request',
            user: userObject
        })
    }
}


handler._user.get = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone :  false;

    if(phone) {
        // find the user
        data.read('users', phone, (err, user) => {
            user = {...parseJSON(user)};

            if (!err && user) {
                delete user.password;
                callback(200, user)
            }
            else {
                callback(404, {
                    'error':  'user not founded'
                })
            }
        })
    }
    else {
        callback(404, {
            'message': 'User not found'
        })
    }
}


handler._user.put = (requestProperties, callback) => {

}


handler._user.delete = (requestProperties, callback) => {

}









module.exports = handler;