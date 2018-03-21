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
	}).fail(err => {
		if(err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
})

$(document).ready(() => {
	$.ajax({
		url: '/data/zhongyao',
	}).done(data => {
		filtered = data
		original = data
	}).fail(err => {
		if(err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
})

function clickDownload(aLink) {
  var str = filtered.join('\n');
  str =  encodeURIComponent(str);
  aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;
} 