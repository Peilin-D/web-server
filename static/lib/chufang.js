"use strict";

var _dropdown = require("./dropdown.js");

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chufang = [];

$("#submit-chufang").click(function (e) {
  e.preventDefault();
  $("#chufang-table tbody").empty();
  var name = $("#search-chufang").val();
  $.ajax({
    url: '/chufang',
    data: {
      name: name
    }
  }).done(function (data) {
    for (var prop in data) {
      $("#chufang-table tbody").append("\n        <tr>\n          <th>" + prop + "</th>\n          <td>" + data[prop] + "</td>\n        </tr>\n      ");
    }
  }).fail(function (err) {
    if (err.status === 401) {
      alert(err.responseText);
      window.location.replace("/login");
    }
  });
});

$("#chufang").click(function () {
  getData();
});

function getData() {
  if (chufang.length > 0) {
    return;
  }
  $.ajax({
    url: '/data/chufang'
  }).done(function (data) {
    chufang = data;
  }).fail(function (err) {
    if (err.status === 401) {
      alert(err.responseText);
      window.location.replace("/login");
    }
  });
}

$('#search-chufang.dropdown-input').on('keyup', function (e) {
  e.stopPropagation();
  var val = e.target.value;
  var id = e.target.id;
  (0, _dropdown2.default)(chufang, val, id);
});

$('#search-chufang.dropdown-input').click(function (e) {
  e.stopPropagation();
  var val = e.target.value;
  var id = e.target.id;
  (0, _dropdown2.default)(chufang, val, id);
});