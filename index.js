/*
* Title: Uptime Monitoring Application
* Desc: A Restful API to monitor up or down time of user defined links
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments')

// app object or module scafolding
const app = {};

// configurations
// app.config = {
//     port: 3000
// };

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`environment variable is ${environment.envName}`)
        console.log(`listening to port ${environment.port}`);
    });
}

// handle request, response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
