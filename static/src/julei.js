$("#submit-julei").click(e => {
	e.preventDefault()
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		},
		headers: {
			'Cache-Control': 'no-cache' 
		}
	}).done(data => {
		console.log(data)
		$("#dendrogram").empty()
		document.getElementById('dendrogram').src=data
	})
})