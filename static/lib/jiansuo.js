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