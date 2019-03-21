const content = {};
const getElementsApi = '/api/get_layout_elements/';
const getContentApi = '/api/get_layout_content/';
const setContentApi = '/api/set_element_content/';

const getJSON = response => {return response.json();};

const getLayout = name => {
  fetch(
    getElementsApi + name
  ).then(
    getJSON
  ).then(
    json => createBody(name, json)
  );
}

const getContent = name => {
  fetch(
    getContentApi + name
  ).then(
    getJSON
  ).then(
    updateBody
  )
}

const getEditor = name => {
  fetch(
    getContentApi + name
  ).then(
    getJSON
  ).then(
    createForm
  )
}

function createBody(name, data) {
  data.forEach(element => {
    content[element.id] = element.content || '';
  });
  $('body').html(renderBody(name, data));
}

function updateBody(data) {
  Object.keys(content).forEach((id) => {
    if (content[id] !== data[id]) {
      content[id] = data[id];
      $(`#${id}`).html(`<content>${data[id]}</content>`);
    }
  });
}

function createForm(data) {
  let elements = [];

  Object.keys(data).forEach((name) => {
    elements.push({
      id: name,
      content: data[name]
    });
  });

  $('body').html(renderForm(setContentApi, elements));

  $('input[type=submit]').click((event) => {
    event.preventDefault();
  });
}
