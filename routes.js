const url = require('url');
const fs = require('fs');
const getLayoutHtml = require('./layout').getLayoutHtml;

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

function serve404(response) {
  console.log('bad request');
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('404: Bad route / file not found');
}

function getRequestContent(path) {
  if (path.includes('.css')) {
      return (response) => {serveCss(`./${path}`, response);};
  } else if (pathIsImage(path)) {
    return (response) => {serveImage(`./${path}`, response);};
  } else if (path.includes('.js')) {
    return (response) => {serveJs(`./${path}`, response);};
  } else if (path.includes('.json')) {
    return (response) => {serveJson(`./${path}`, response);};
  }
}

function serveLayout(path, response) {
  fs.readFile('./layout.json', 'utf8', (err, data) => {
    if (err) {
      throw err;
    } else {
      Object.assign(layoutData, JSON.parse(data));
      let name = path.replace('/', '');

      if (layoutData.layouts[name]) {
        setContentType(response, 'text/html');
        response.end(getLayoutHtml(name, layoutData));

      } else {
        serve404(response);
      }

    }
  });
}

module.exports = {
  handleRequest: function (request, response) {
    console.log('\n REQUEST MADE: ' + request.url);
    let serve = getRequestContent(request.url);

    if (serve) {
      serve(response);
    } else {
      serveLayout(request.url, response);
    }

  }
};
