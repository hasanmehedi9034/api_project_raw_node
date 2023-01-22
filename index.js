/*
* Title: Uptime Monitoring Application
* Desc: A Restful API to monitor up or down time of user defined links
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments')
const data = require('./lib/data')

// app object or module scafolding
const app = {};

// configurations
// app.config = {
//     port: 3000
// };

// testing file system
// data.create('test', 'newFile', {name: 'Bangladesh', lang: 'bangla'}, (err) => {
//     console.log('error was', err);
// })

// data.read('test', 'newFile', (err, data) => {
//     console.log(err);
// })

// data.delete('test', 'newFile', (err) => {

// })

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
