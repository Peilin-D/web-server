$("#submit-name").click(e => {
	e.preventDefault();
	$("#description tbody").empty()
	var name = $("#search").val()
	$.ajax({
		url: '/jiansuo',
		data: {
			name: name
		}
	}).done(data => {
		for (prop in data) {
			$("#description tbody").append(`
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

$(document).ready(() => {
	$.ajax({
		url: '/data/zhongyao',
	}).done(data => {
		filtered = data
		original = data
	})
})