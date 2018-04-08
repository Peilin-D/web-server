$("#submit-julei").click(e => {
	e.preventDefault()
	$("#tree").empty()
	$("#vis").empty()
	$("#zhiliang-table").empty()
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		}
	}).done(data => {
		let path = data[0]
		let table = data[1]
		console.log(table)
		$("#tree").append(`<img id="dendrogram" style="width:600px;height:500px;" src=${path[0]}?${new Date().getTime()}>`)
		$("#vis").append(`<img id="julei" style="width:600px;height:500px;" src=${path[1]}?${new Date().getTime()}>`)
		let headers = table[0]
		$("#zhiliang-table").append("<thead></thead>")
		$("#zhiliang-table").append("<tbody></tbody>")
		$("#zhiliang-table thead").append("<tr></tr>")
		headers.forEach(h => {
			$("#zhiliang-table thead tr").append(`<th>${h}</th>`)
		})
		for (let i = 1; i < table.length; i++) {
			let row = ""
			table[i].forEach(elem => {
				row += `<td>${elem}</td>`        //creat data cells for the table
			})
			$("#zhiliang-table tbody").append(`<tr>${row}</tr>`)        //create a row for the table
		}
	})
})