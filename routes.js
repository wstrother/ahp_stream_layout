var url = require('url');
var fs = require('fs');

function renderHtml(path, response) {
  fs.readFile(path, null, function(error, data) {
    if (error) {
      response.writeHead(404);
      response.end('File not Found');
    } else {
      if (path.includes('.css')) {
        response.writeHead(200, {'Content-Type': 'text/css'});
      }
      response.write(data);
      response.end();
    }
  });
}

function getPathAsFile(path) {
  switch (path) {
    case '/':
      return './index.html';

    case '/script.js':
      return './script.js';

    case '/info.json':
      return './info.json';

    case '/layout.js':
      return './layout.js';

    case '/layout.json':
      return './layout.json';

    case '/style.css':
      return './style.css';

    case '/side-panel.png':
      return './side-panel.png';

    default:
      return false;
  }
}

module.exports = {
  handleRequest: function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    var path = url.parse(request.url).pathname;
    var index = '/';

    console.log('\n REQUEST MADE: ' + path);

    var file_name = getPathAsFile(path);
    if (file_name) {
      renderHtml(file_name, response);
    } else {
      console.log('route undefined: ' + path);
      response.writeHead(404);
      response.end();
    }
  }
};
