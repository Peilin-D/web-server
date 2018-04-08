"use strict";

$("#submit-julei").click(function (e) {
	e.preventDefault();
	$("#tree").empty();
	$("#vis").empty();
	$("#zhiliang-table").empty();
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		}
	}).done(function (data) {
		var path = data[0];
		var table = data[1];
		console.log(table);
		$("#tree").append("<img id=\"dendrogram\" style=\"width:600px;height:500px;\" src=" + path[0] + "?" + new Date().getTime() + ">");
		$("#vis").append("<img id=\"julei\" style=\"width:600px;height:500px;\" src=" + path[1] + "?" + new Date().getTime() + ">");
		var headers = table[0];
		$("#zhiliang-table").append("<thead></thead>");
		$("#zhiliang-table").append("<tbody></tbody>");
		$("#zhiliang-table thead").append("<tr></tr>");
		headers.forEach(function (h) {
			$("#zhiliang-table thead tr").append("<th>" + h + "</th>");
		});
		for (var i = 1; i < table.length; i++) {
			var row = "";
			table[i].forEach(function (elem) {
				row += "<td>" + elem + "</td>"; //creat data cells for the table
			});
			$("#zhiliang-table tbody").append("<tr>" + row + "</tr>"); //create a row for the table
		}
	});
});