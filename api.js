const fs = require('fs');
const layoutFile = 'layout.json';
const querystring = require('querystring');

//
// Retrieve data from layoutFile and run callback function
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

//
// Write new data to layoutFile
function setLayoutData(data) {
  fs.writeFile(`./${layoutFile}`, JSON.stringify(data, null, 2),
    (err, result) => {if(err) console.log("error", err);}
  );
  console.log('updated ' + layoutFile);
}

//
// JSON response functions
function setJsonHeader(response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
}

function setJsonError(response, message) {
  response.status = 404
  response.end(JSON.stringify({
    error: message
  }));
}

function setJsonResponse(response, obj) {
  response.end(JSON.stringify(obj));
}

//
// api/get_layout_elements/{name}
// response [element1, element2...]
// element {id: name, size: [0, 0], position: [0, 0]...}
//
function getLayoutElements(request, response) {
  setJsonHeader(response);
  let layoutName = request.url.split('/get_layout_elements/')[1];

  let sendError = msg => {
    setJsonError(response, msg);
  }

  getLayoutData(response, (data) => {
    let elements = data.elements;
    let layoutData = data.layouts[layoutName];

    if (!layoutData) {
      sendError(`No layout found called '${layoutName}'`);

    } else {
      let output = [];

      layoutData.elements.forEach((element) => {
        output.push(Object.assign({},
          elements[element.id], element
        ));
      });
      response.end(JSON.stringify(output));
    }

  });
}

//
// api/get_layout_content/{name}
// response {id1: "", id2: ""}
//
function getLayoutContent(request, response) {
  setJsonHeader(response);
  let layoutName = request.url.split('/get_layout_content/')[1];
  let pushContent = (elementsData, names) => {
    let output = {};

    names.forEach(name => {
      output[name] = elementsData[name].content || '';
    });

    return output;
  }

  let sendError = msg => {
    setJsonError(response, msg);
  };

  getLayoutData(response, data => {
    let sendContent = names => {
      setJsonResponse(response, pushContent(data.elements, names));
    };

    if (layoutName === 'all') {
      sendContent(Object.keys(data.elements));
    } else {
      let layoutData = data.layouts[layoutName];

      if (!layoutData) {
        sendError(`No layout found called '${layoutName}'`);

      } else {
        let names = [];
        layoutData.elements.forEach(element => {
          names.push(element.id);}
        );

        sendContent(names);
      }
    }
  });
}

//
// api/set_element_content
// request {method: "POST", body}
// body {id1: "", id2: ""...}
//
function setElementContent(request, response) {
  setJsonHeader(response);
  let sendError = msg => {
    setJsonError(response, msg);
  };

  if (request.method === 'POST') {
    let body = '';

    request.on('data', (chunk) => {
      body = body + chunk.toString();
    })

    request.on('end', () => {
      console.log(body);
      body = querystring.parse(body);

      getLayoutData(response, data => {
        Object.keys(body).forEach(name => {
          if (data.elements[name]) {
            data.elements[name].content = body[name];
          }
          else {
            console.log(`No element called ${name} found in ${layoutFile}`);
          }
        });

        let successResponse = {success: `${layoutFile} updated!`};
        Object.assign(successResponse, body);
        response.end(JSON.stringify(successResponse));

        setLayoutData(data);
      });
    })

  } else {
    setJsonError(response, 'bad method, please use POST for "set_element_content"');
  }

}

module.exports = {
  getLayoutElements,
  getLayoutContent,
  setElementContent
}
