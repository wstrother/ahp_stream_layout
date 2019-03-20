var http = require('http');
var fs = require('fs');
var routes = require('./routes');

var port = 4000


http.createServer(routes.handleRequest).listen(port);
