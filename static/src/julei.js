$("#submit-julei").click(e => {
	e.preventDefault()
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		}
	}).done(data => {
		document.getElementById('dendrogram').src = data + "?" + new Date().getTime();
	})
})