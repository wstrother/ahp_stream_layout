function getJsonContent(filename) {
  $.ajax({
    url: filename,
    dataType: 'json',
    success: function(data) {
      console.log(JSON.stringify(data));
      compareData(data);
    },
    error: function(jqXHR, status, err) {
      console.log(err);
    }
  });
}

var bodyElement = null;
var pageData = {};

function compareData(newData) {
  if (pageData !== newData) {
    setPageBody(newData.text);
  }
  pageData = newData;
}

function setPageBody(text) {
  console.log(bodyElement.html());
  bodyElement.html(text);
}

$(document).ready(function() {
  bodyElement = $('#page-body');
  setInterval(function(){ getJsonContent("info.json");}, 3000);
});
