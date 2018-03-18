$("#submit-freq").click(e => {
	//console.log(diseases)
	e.preventDefault()
	$("#bz").empty()
	var freq = $("#freq").val()
	$.ajax({
		url: '/tuijian',
		data: {
			freq: freq
		}
	}).done(data => {
		console.log(data)
	}).fail(() => {
		alert("服务器出错")
	})
})