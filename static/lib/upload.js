"use strict";

var _dropdown = require("./dropdown.js");

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bingzheng = [];

$("#yiy").change(function (e) {
  $("#file-chosen").text(e.target.files[0].name);
});

$(document).ready(function () {
  getData();
});

function getData() {
  if (bingzheng.length > 0) {
    return;
  }
  $.ajax({
    url: '/data/diseases'
  }).done(function (data) {
    bingzheng = data;
    $("input#disease").val(bingzheng[0]);
  }).fail(function (err) {
    if (err.status === 401) {
      alert(err.responseText);
      window.location.replace("/login");
    }
  });
}

// $("#run").click(function(e) {
//   e.preventDefault()
//   var data = new FormData($("#file-form")[0])
//   var xhr = new XMLHttpRequest()
//   if (xhr.upload) {
//     xhr.upload.addEventListener('progress', function(e) {
//       if (e.lengthComputable) {
//         $('#upload-progress').css({width: `${e.loaded * 100 / e.total}%` });
//       }
//     }, false);
//   }
//   xhr.open("POST", "/upload")
//   xhr.send(data)
// })

$("#run").click(function (e) {
  e.preventDefault();
  // show loading animation
  $(".loader-div").css("display", "block");
  $.ajax({
    url: "/disease",
    data: {
      disease: $("input#disease").val()
    }
  }).done(function () {
    window.location.replace("/panel");
  });
});

$('#disease.dropdown-input').on('keyup', function (e) {
  e.stopPropagation();
  var val = e.target.value;
  var id = e.target.id;
  (0, _dropdown2.default)(bingzheng, val, id);
});

$('#disease.dropdown-input').click(function (e) {
  e.stopPropagation();
  var val = e.target.value;
  var id = e.target.id;
  (0, _dropdown2.default)(bingzheng, val, id);
});