(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"./dropdown.js":1}]},{},[2]);
