const url = require('url');
const fs = require('fs');
const getLayoutHtml = require('./layout').getLayoutHtml;
const api = require('./api');
const layoutData = {};

function setContentType(response, value) {
  response.writeHead(200, {'Content-Type': value});
}

function pathIsImage(path) {
  let exts = ['.gif', '.png', '.jpg', '.svg', '.bmp'];
  return exts.some((ext) => {return path.includes(ext)});
}

function serveImage(path, response) {
  let ext = path.split(".").pop();
  setContentType(response, `image/${ext}`);
  fs.createReadStream(path).pipe(response);
}

function serveCss(path, response) {
  setContentType(response, 'text/css');
  fs.createReadStream(path).pipe(response);
}

function serveJson(path, response) {
  setContentType(response, 'application/json');
  fs.createReadStream(path).pipe(response);
}

function serveJs(path, response) {
  setContentType(response, 'application/javascript');
  fs.createReadStream(path).pipe(response);
}

function serveHtml(path, response) {
  setContentType(response, 'text/html');
  fs.createReadStream(path).pipe(response);
}

function serve404(response) {
  console.log('bad request');
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('404: Bad route / file not found');
}

function getRequestContent(path) {
  if (path.includes('.html')) {
    return (response) => {serveHtml(`./${path}`, response);};
  } else if (path.includes('.css')) {
    return (response) => {serveCss(`./${path}`, response);};
  } else if (pathIsImage(path)) {
    return (response) => {serveImage(`./${path}`, response);};
  } else if (path.includes('.js')) {
    return (response) => {serveJs(`./${path}`, response);};
  } else if (path.includes('.json')) {
    return (response) => {serveJson(`./${path}`, response);};
  }
}

function getApiMethod(path) {
  path = path.split('api/')[1];

  if (path.includes('get_layout_elements')) {
    return (request, response) => {
      api.getLayoutElements(request, response);
    };
  }

  if (path.includes('get_layout_content')) {
    return (request, response) => {
      api.getLayoutContent(request, response);
    };
  }

  if (path.includes('set_element_content')) {
    return (request, response) => {
      api.setElementContent(request, response);
    };
  };
}

function serveLayout(path, response) {
  if (path.includes('/editor')) {
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
