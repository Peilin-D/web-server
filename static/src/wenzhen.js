$("#submit-bz").click(e => {
		//console.log(diseases)
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
		}).fail(() => {
			alert("服务器出错")
		})
	})