const url = require('url');
const fs = require('fs');
const path = require('path');
const api = require('./api');

//
// response and file serve functions
//
function setContentType(response, value) {
  response.writeHead(200, {'Content-Type': value});
}

function serveFile(fileName, response, contentType) {
  setContentType(response, contentType);
  let file = fs.createReadStream(fileName);
  file.on('error', (error) => {
    console.log(error.message);
    serve404(response);
  });
  file.pipe(response);
}

function urlIsImage(fileName) {
  let exts = ['.gif', '.png', '.jpg', '.svg', '.bmp'];
  return exts.some((ext) => {return fileName.includes(ext)});
}

function serveImage(fileName, response) {
  let ext = fileName.split(".").pop();
  serveFile(`images/${fileName}`, response, `image/${ext}`);
}

function serveCss(fileName, response) {
  serveFile(`css/${fileName}`, response, 'text/css');
}

function serveJson(fileName, response) {
  serveFile(fileName, response, 'application/json');
}

function serveJs(fileName, response) {
  serveFile(`scripts/${fileName}`, response, 'application/javascript');
}

function serveHtml(fileName, response) {
  serveFile(`html/${fileName}`, response, 'text/html');
}

function serve404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('404: Bad route / file not found');
}

function getRequestContent(url) {
  url = path.basename(url);

  let fileName = `./${url}`;
  let getFile = [
    [p => p.includes('.html'), res => serveHtml(fileName, res)],
    [p => p.includes('.css'), res => serveCss(fileName, res)],
    [p => urlIsImage(p), res => serveImage(fileName, res)],
    [p => p.includes('.json'), res => serveJson(fileName, res)],
    [p => p.includes('.js'), res => serveJs(fileName, res)]
  ]

  let serve = null;

  getFile.forEach(check => {
    if (check[0](url)) {
      serve = check[1];
    }
  });

  return serve;
}

function getApiMethod(url) {
  // url = url.split('api/')[1];

  if (url.includes('get_layout_elements')) {
    return (request, response) => {
      api.getLayoutElements(request, response);
    };
  }

  if (url.includes('get_layout_content')) {
    return (request, response) => {
      api.getLayoutContent(request, response);
    };
  }

  if (url.includes('set_element_content')) {
    return (request, response) => {
      api.setElementContent(request, response);
    };
  };
}

function serveLayout(url, response) {
  if (url.includes('/editor')) {
    serveHtml('./editor.html', response);
  } else {
    serveHtml('./layout.html', response);
  }
}

module.exports = {
  handleRequest: function (request, response) {
    console.log('\n REQUEST MADE: ' + request.url);
    let serve = getRequestContent(request.url);

    if (serve) {
      serve(response);
    } else {
      if (request.url.includes('/api/')) {
        let apiMethod = getApiMethod(request.url);

        if (apiMethod) {
          apiMethod(request, response);
        } else {
          response.writeHead(400);
          response.end('bad api request ' + request.url);
        }
      } else {
        serveLayout(request.url, response);
      }
    }

  }
};
