$("#submit-julei").click(e => {
	e.preventDefault()
	$("#tree div").empty()
	$("#vis div").empty()
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		}
	}).done(data => {
		$("#tree div").append(`<img id="dendrogram" style="width:600px;height:500px;">`)
		document.getElementById('dendrogram').src = data[0] + "?" + new Date().getTime();
		$("#vis div").append(`<img id="julei" style="width:600px;height:500px;">`)
		document.getElementById('julei').src = data[1] + "?" + new Date().getTime();
	})
})