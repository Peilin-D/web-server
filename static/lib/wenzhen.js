"use strict";

var _dropdown = require("./dropdown.js");

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var binghou = [];

$("#submit-bz").click(function (e) {
	e.preventDefault();
	$("#bz").empty();
	var arr = $("form").serializeArray();
	$.ajax({
		url: '/wenzhen',
		data: arr
	}).done(function (data) {
		data.forEach(function (d) {
			$("#bz").append("<div>" + d + "</div>");
		});
	}).fail(function (err) {
		if (err.status === 401) {
			alert(err.responseText);
			window.location.replace("/login");
		}
	});
});

$(document).ready(function () {
	getData();
});

$("#wenzhen").click(function () {
	getData();
});

function getData() {
	if (binghou.length > 0) {
		return;
	}
	$.ajax({
		url: '/data/binghou'
	}).done(function (data) {
		binghou = data;
	}).fail(function (err) {
		if (err.status === 401) {
			alert(err.responseText);
			window.location.replace("/login");
		}
	});
}

$('.dropdown-input').on('keyup', function (e) {
	e.stopPropagation();
	var val = e.target.value;
	var id = e.target.id;
	(0, _dropdown2.default)(binghou, val, id);
});

$('.dropdown-input').click(function (e) {
	e.stopPropagation();
	var val = e.target.value;
	var id = e.target.id;
	(0, _dropdown2.default)(binghou, val, id);
});