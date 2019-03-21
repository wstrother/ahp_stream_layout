const fs = require('fs');
const { Writable } = require('stream');
const layoutFile = 'layout.json';

function getLayoutData(response, callback) {
  let rs = fs.createReadStream(`./${layoutFile}`, 'utf8');
  let data = '';
  setJsonHeader(response);

  rs.on('error', () => {
    setJsonError(response, `No '${layoutFile}' found on server`);
  });

  rs.on('data', (chunk) => {
    data = data + chunk;
  });

  rs.on('end', () => {
    data = JSON.parse(data);
    if (!data.elements) {
      setJsonError(response, `${layoutFile} missing 'elements'`);
    } else if (!data.layouts) {
      setJsonError(response, `${layoutFile} missing 'layouts'`);
    } else {
      callback(data);
    }
  });

}

function setJsonHeader(response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
}

function setJsonError(response, message) {
  response.status = 404
  response.end(JSON.stringify({
    error: message
  }));
}

function getLayoutElements(request, response) {
  let layoutName = request.url.split('/get_layout_elements/')[1];
  let output = [];

  getLayoutData(response, (data) => {
    let elements = data.elements;
    let layoutData = data.layouts[layoutName];

    if (!layoutData) {
      setJsonError(response, `No layout found called '${layoutName}'`);
    } else {

      layoutData.elements.forEach((element) => {
        output.push(Object.assign({},
          elements[element.id], element
        ));
      });
      response.end(JSON.stringify(output));
    }

  });
}

function getLayoutContent(request, response) {
  let layoutName = request.url.split('/get_layout_content/')[1];
  let output = {};

  getLayoutData(response, (data) => {
    let elements = data.elements;
    let layoutData = data.layouts[layoutName];

    if (!layoutData) {
      setJsonError(response, `No layout found called '${layoutName}'`);
    } else {
      let content = '';

      layoutData.elements.forEach((element) => {
        content = elements[element.id].content;
        if (!content) {content = '';}
        output[element.id] = content;
      });
      response.end(JSON.stringify(output));

    }
  });
}

function setElementContent(request, response) {

}

module.exports = {
  getLayoutElements: getLayoutElements,
  getLayoutContent: getLayoutContent,
  setElementContent: setElementContent
}
