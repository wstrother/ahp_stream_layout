const http = require('http');
const routes = require('./routes');

const port = 4000;
const ip = '127.0.0.1';

http.createServer(routes.handleRequest).listen(port, ip);

console.log(`listening on ${ip}:${port}`);
