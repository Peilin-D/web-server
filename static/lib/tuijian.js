"use strict";

$("#submit-freq").click(function (e) {
	//console.log(diseases)
	e.preventDefault();
	$("#chufang tbody").empty();
	var freq = $("#freq").val();
	$.ajax({
		url: '/tuijian',
		data: {
			freq: freq
		}
	}).done(function (data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			$("#chufang tbody").append("\n\t\t\t\t<tr>\n\t\t\t\t\t<th>" + i + "</th>\n\t\t\t\t\t<td>" + data[i] + "</td>\n\t\t\t\t</tr>\n\t\t\t");
		}
	}).fail(function (err) {
		if (err.status === 401) {
			alert(err.responseText);
			window.location.replace("/login");
		}
	});
});