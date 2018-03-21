$("#submit-freq").click(e => {
	//console.log(diseases)
	e.preventDefault()
	$("#chufang tbody").empty()
	var freq = $("#freq").val()
	$.ajax({
		url: '/tuijian',
		data: {
			freq: freq
		}
	}).done(data => {
		for (prop in data) {
			$("#chufang tbody").append(`
				<tr>
					<th>${prop}</th>
					<td>${data[prop]}</td>
				</tr>
			`)
		}
	}).fail(err => {
		if (err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
})