const http = require('http');
const routes = require('./routes');

const port = 4000;
const ip = '127.0.0.1';

const lport = 8000;
//const lip = '';

http.createServer(routes.handleRequest).listen(port, ip);
console.log(`listening on ${ip}:${port}`);

//http.createServer(routes.handleRequest).listen(lport, lip);
//console.log(`listening on ${lip}:${lport}`);