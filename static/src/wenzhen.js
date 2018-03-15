let binghou = []
let filteredBinghou = []
let chosenBinghou = ""

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

$(document).ready(() => {
	$.ajax({
		url: '/data/binghou',
	}).done(data => {
		binghou = data
		filteredBinghou = binghou
	})
})

$(document).click(() => {
  $('.scrollable-menu').empty();
})

function create(index, id) {
  var elem = $(`<button class='dropdown-item' type='button'>${filteredBinghou[index]}</button>`)
  elem.click(() => {
    $(`.dropdown-input#${id}`).val(filteredBinghou[index])
    chosenBinghou = filteredBinghou[index];
    $('.scrollable-menu').empty()
  })
  return elem
}

function showMenu(id) {
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', $('.dropdown-input').outerWidth())
  var elems = []
  for (var i = 0; i < filteredBinghou.length; i++) {
    elems.push(create(i, id))
  }
  $(`.scrollable-menu#${id}`).append(elems);
}

function filter(currentVal) {
  if (currentVal === '') {
    filteredBinghou = binghou;
  } else {
    filteredBinghou = binghou.filter(d => d.startsWith(currentVal));
  }
}

$('.dropdown-input').on('keyup', () => {
	filter();
  showMenu();
})

$('.dropdown-input').click(e => {
	e.stopPropagation();
	let val = e.target.value
  filter(val);
  let id = e.target.id
  showMenu(id);
})
