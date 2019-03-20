function getObjAsCss(obj) {
  let props = []

  Object.keys(obj).forEach((key) => {
    props.push(`${key}: ${obj[key]}`);
  });

  return props.join('; ');
}

function renderDiv(data) {
  let size = data.size || [0, 0];
  let position = data.position || [0, 0];
  let content = data.content || '';

  let style = {
    'width': `${size[0]}px`,
    'height': `${size[1]}px`,
    'left': `${position[0]}px`,
    'top': `${position[1]}px`,
    'position': 'absolute'
  }

  if (data.image) {
    style['background-image'] = `url('${data.image}')`;
  }

  style = getObjAsCss(style);

  return `
  <div style="${style}" id="${data.id}">
    <content>${content}</content>
  </div>`;
}

function renderBody(name, elements) {
  let divs = "";

  elements.forEach((element) => {
    divs += "\n" + renderDiv(element);
  });

  return `
  <body>
  <layout id="${name}">
  ${divs}

  </layout>
  </body>`;
}

module.exports.renderBody = renderBody;
