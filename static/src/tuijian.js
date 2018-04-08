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
		console.log(data)
		for (var i = 0; i < data.length; i++) {
			$("#chufang tbody").append(`
				<tr>
					<th>${i}</th>
					<td>${data[i]}</td>
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