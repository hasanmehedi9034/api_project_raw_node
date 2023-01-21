/*
* Title: Uptime Monitoring Application
* Desc: A Restful API to monitor up or down time of user defined links
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes')

// app object or module scafolding
const app = {};

// configurations
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
}

// handle request, response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
