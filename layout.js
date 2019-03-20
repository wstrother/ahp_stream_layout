function getJsonContent(filename, func) {
  $.ajax({
    url: filename,
    dataType: 'json',
    success: func,
    error: function(jqXHR, status, err) {
      console.log(err);
    }
  });
}

function renderDiv(body, data) {
  var inner = `<div id="${data.id}">${data.content || ""}</div>`;
  var style = getDivStyle(data);

  body.append(inner);
  $(`#${data.id}`).css(style);

  console.log(JSON.stringify(data));
}

function getDivStyle(data) {
  var style = {
    'width': `${data.size[0]}px`,
    'height': `${data.size[1]}px`,
    'left': `${data.position[0]}px`,
    'top': `${data.position[1]}px`,
    'position': 'absolute'
  }

  // if (data.image) {
  //   style['background-image'] = data.image;
  // }

  return style
}

function addLayoutElements(body, elements) {
  elements.forEach(function(element) {
    renderDiv(body, element);
  });
}

function setLayoutBody(body, data) {
  var color = data.colorkey || [0, 0, 0];

  body.css({
    'padding': '0',
    'margin': '0',
    // 'background-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    'width': `${data.size[0]}px`,
    'height': `${data.size[1]}px`
  });
}

$(document).ready(function () {
  getJsonContent('layout.json', function (data) {
    var bodyElement = $('body');
    addLayoutElements(bodyElement, data.elements);
    setLayoutBody(bodyElement, data.stream);
  });
});
