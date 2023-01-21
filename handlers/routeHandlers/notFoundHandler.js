/*
* Title: Sample handler
* Description: Sample handler
*/

// module scafolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(404, {
        message: 'this  is not found route'
    })
}

module.exports = handler;