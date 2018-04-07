import showMenu from './dropdown.js'

let binghou = []

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
  getData()
})

$("#wenzhen").click(() => {
  getData()
})

function getData() {
  if (binghou.length > 0) {
    return
  }
	$.ajax({
		url: '/data/binghou',
	}).done(data => {
    binghou = data
	}).fail(err => {
		if (err.status === 401) {
			alert(err.responseText)
			window.location.replace("/login")
		}
	})
}

$('.dropdown-input').on('keyup', e => {
  e.stopPropagation()
  let val = e.target.value
  let id = e.target.id
  showMenu(binghou, val, id);
})

$('.dropdown-input').click(e => {
  e.stopPropagation();
  var val = e.target.value
  var id = e.target.id
  showMenu(binghou, val, id);
})


