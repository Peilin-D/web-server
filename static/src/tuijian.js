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
	}).fail(() => {
		alert("服务器出错")
	})
})