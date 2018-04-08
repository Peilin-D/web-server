(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./dropdown.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = showMenu;
$(document).click(function () {
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', 0);
});

function create(item, id) {
  var elem = $('<button class=\'dropdown-item\' type=\'button\'>' + item + '</button>');
  elem.click(function () {
    $('#' + id + '.dropdown-input').val(item);
    $('.scrollable-menu').empty();
  });
  return elem;
}

function showMenu(original, currenVal, id) {
  var filtered = filter(original, currenVal);
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', $('.dropdown-input').outerWidth());
  var elems = [];
  for (var i = 0; i < filtered.length; i++) {
    elems.push(create(filtered[i], id));
  }
  $('#' + id + '.scrollable-menu').append(elems);
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

function filter(original, currentVal) {
  if (currentVal === '') {
    return original;
  } else {
    return original.filter(function (d) {
      return d.startsWith(currentVal);
    });
  }
}
},{}]},{},[1]);
