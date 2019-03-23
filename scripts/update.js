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

  $('editor').html(renderForm(setContentApi, elements));

  let params = {};

  $('form').on("submit", event => {
    event.preventDefault();

    let form = $(event.target);
    let formID = form.find('input[name="id"]').val();
    let formContent = form.find('input[name="content"]').val();
    params[formID] = formContent;

    let resultsElement = $('results');
    $.ajax({
        url: `..${setContentApi}`,
        type: 'POST',
        dataType: 'html',
        data: jQuery.param(params),

        beforeSend: function() {
          resultsElement.html(`<div class="editor-sending">Updating...</div>`);
        },

        success: function(result, status, xhr) {
          resultsElement.html(renderResults(result));
        },

        error: function(xhr, status, err) {
          if (!err) {err = "No server response";}

          resultsElement.html(
            `<div class="editor-error">
            <strong>Error:</strong> ${err}
            </div>`
          );
        }
    });

  });
}
