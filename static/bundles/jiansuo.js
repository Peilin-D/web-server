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

var zhongyao = [];

$("#submit-zhongyao").click(function (e) {
	e.preventDefault();
	$("#description tbody").empty();
	var name = $("input#search-zhongyao").val();
	$.ajax({
		url: '/jiansuo',
		data: {
			name: name
		}
	}).done(function (data) {
		for (var prop in data) {
			$("#description tbody").append("\n\t\t\t\t<tr>\n\t\t\t\t\t<th>" + prop + "</th>\n\t\t\t\t\t<td>" + data[prop] + "</td>\n\t\t\t\t</tr>\n\t\t\t");
		}
	}).fail(function (err) {
		if (err.status === 401) {
			alert(err.responseText);
			window.location.replace("/login");
		}
	});
});

$("#jiansuo").click(function () {
	getData();
});

function getData() {
	if (zhongyao.length > 0) {
		return;
	}
	$.ajax({
		url: '/data/zhongyao'
	}).done(function (data) {
		zhongyao = data;
	}).fail(function (err) {
		if (err.status === 401) {
			alert(err.responseText);
			window.location.replace("/login");
		}
	});
}

$('#search-zhongyao.dropdown-input').on('keyup', function (e) {
	e.stopPropagation();
	var val = e.target.value;
	var id = e.target.id;
	(0, _dropdown2.default)(zhongyao, val, id);
});

$('#search-zhongyao.dropdown-input').click(function (e) {
	e.stopPropagation();
	var val = e.target.value;
	var id = e.target.id;
	(0, _dropdown2.default)(zhongyao, val, id);
});

// function clickDownload(aLink) {
//   var str = filtered.join('\n');
//   str =  encodeURIComponent(str);
//   aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;
// }
},{"./dropdown.js":1}]},{},[2]);
