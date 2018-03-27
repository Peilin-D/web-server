$("#submit-julei").click(e => {
	e.preventDefault()
	$("#tree").empty()
	$("#vis").empty()
	$.ajax({
		url: "/julei",
		data: {
			distance: $("#distance").val(),
			method: $("#method").val(),
			cut: $("#cut").val()
		}
	}).done(data => {
		console.log(data)
		$("#tree").append(`<img id="dendrogram" style="width:600px;height:500px;" src=${data[0]}?${new Date().getTime()}>`)
		$("#vis").append(`<img id="julei" style="width:600px;height:500px;" src=${data[1]}?${new Date().getTime()}>`)
	})
})