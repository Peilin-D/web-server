$('#login').click(e => {
	$.get('/main', data => {
		$("body").html(data)
	})
})

$('#register').click(e => {
	$.get('/register', data => {
		$("body").html(data)
	})
})