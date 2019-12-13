const http = require('http');
const routes = require('./routes');

// run app on your own machine
const port = 4000;
const ip = '127.0.0.1';


// run app on LAN
// const port = {YOUR PORT NUMBER};
// const ip = {YOUR INTERNAL IP};

// launch server
http.createServer(routes.handleRequest).listen(port, ip);
console.log(`listening on ${ip}:${port}`);
