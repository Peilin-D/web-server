import showMenu from './dropdown.js'

let zhongyao = []

$("#submit-zhongyao").click(e => {
	e.preventDefault();
	$("#description tbody").empty()
	var name = $("input#search-zhongyao").val()
	$.ajax({
		url: '/jiansuo',
		data: {
			name: name
		}
	}).done(data => {
		for (var prop in data) {
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

$("#jiansuo").click(() => {
  getData()
})

function getData() {
  if (zhongyao.length > 0) {
    return
  }
	$.ajax({
		url: '/data/zhongyao',
	}).done(data => {
    zhongyao = data
	}).fail(err => {
		if(err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
}

$('#search-zhongyao.dropdown-input').on('keyup', e => {
  e.stopPropagation()
  let val = e.target.value
  let id = e.target.id
  showMenu(zhongyao, val, id);
})

$('#search-zhongyao.dropdown-input').click(e => {
  e.stopPropagation();
  var val = e.target.value
  var id = e.target.id
  showMenu(zhongyao, val, id);
})

// function clickDownload(aLink) {
//   var str = filtered.join('\n');
//   str =  encodeURIComponent(str);
//   aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;
// } 