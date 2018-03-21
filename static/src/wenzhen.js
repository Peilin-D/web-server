$("#submit-bz").click(e => {
	e.preventDefault()
	$("#bz").empty()
	var arr = $("form").serializeArray()
	$.ajax({
		url: '/wenzhen',
		data: arr
	}).done(data => {
		data.forEach(d => {
			$("#bz").append(`<div>${d}</div>`)
		})
	}).fail(err => {
		if (err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
})

$(document).ready(() => {
	$.ajax({
		url: '/data/binghou',
	}).done(data => {
		filtered = data
		original = data
	}).fail(err => {
		if (err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
})