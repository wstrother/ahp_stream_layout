const root = 'http://127.0.0.1:4000';

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
    style['background-image'] = `url('${root}/${data.image}')`;
  }

  style = getObjAsCss(style);

  return `
  <div style="${style}" id="${data.id}">
    <content>${content}</content>
  </div>`;
}

function renderBody(name, elements) {
  let divs = '';

  elements.forEach((element) => {
    divs += '\n' + renderDiv(element);
  });

  return `
  <layout id="layout-${name}">
  ${divs}

  </layout>`;
}

function renderInput(url, name, content) {
  return `
  <form method="POST" action="${root + url}">
    <div class="editor-element">
      <label for=${name}>${name}:</label>
      <input name="id" type="hidden" value="${name}" />
      <input name="content" value="${content}" />
      <input type="submit" value="Update" />
    </div>
  </form>
  `;
}

function renderForm(url, elements) {
  let inputs = '';
  console.log(elements.length);

  elements.forEach((element) => {
    inputs = inputs + '\n' + renderInput(url, element.id, element.content);
  });

  return inputs;
}
