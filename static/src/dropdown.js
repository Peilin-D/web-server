var filtered = []
var original = []

$(document).click(() => {
  $('.scrollable-menu').empty();
})

function create(index, id) {
  var elem = $(`<button class='dropdown-item' type='button'>${filtered[index]}</button>`)
  elem.click(() => {
    $(`.dropdown-input#${id}`).val(filtered[index])
    $('.scrollable-menu').empty()
  })
  return elem
}

function showMenu(id) {
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', $('.dropdown-input').outerWidth())
  var elems = []
  for (var i = 0; i < filtered.length; i++) {
    elems.push(create(i, id))
  }
  $(`.scrollable-menu#${id}`).append(elems);
}

function filter(currentVal) {
  if (currentVal === '') {
    filtered = original;
  } else {
    filtered = original.filter(d => d.startsWith(currentVal));
  }
}

$('.dropdown-input').on('keyup', e => {
	e.stopPropagation()
	let val = e.target.value
	let id = e.target.id
	filter(val);
	showMenu(id);
})

$('.dropdown-input').click(e => {
	e.stopPropagation();
	var val = e.target.value
	var id = e.target.id
  filter(val);
  showMenu(id);
})