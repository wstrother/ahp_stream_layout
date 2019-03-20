const render = require('./render');
const fs = require('fs');
var head = "";

fs.readFile('./head.html', 'utf8', (err, data) => {
  if (err) {
    throw err;
  } else {
    head = data;
  }
});

function getElementsData(layout, elements) {
  let output = [];
  let name = "";

  layout.elements.forEach((data) => {
      name = data.id;
      output.push(Object.assign({}, elements[name], data));
  });

  return output;
}

function getLayoutHtml(name, data) {
  let body = render.renderBody(
    name, getElementsData(data.layouts[name], data.elements)
  );

  return `
<!DOCTYPE html>
<html>
${head}

${body}

</html>`;
}

module.exports.getLayoutHtml = getLayoutHtml;
