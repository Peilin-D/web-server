import showMenu from './dropdown.js'

let chufang = []

$("#submit-chufang").click(e => {
  e.preventDefault();
  $("#chufang-table tbody").empty()
  var name = $("#search-chufang").val()
  $.ajax({
    url: '/chufang',
    data: {
      name: name
    }
  }).done(data => {
    for (var prop in data) {
      $("#chufang-table tbody").append(`
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

$("#chufang").click(() => {
  getData()
})

function getData() {
  if (chufang.length > 0) {
    return
  }
  $.ajax({
    url: '/data/chufang',
  }).done(data => {
    chufang = data
  }).fail(err => {
    if(err.status === 401) {
      alert(err.responseText)
      window.location.replace("/login")
    }
  })
}

$('#search-chufang.dropdown-input').on('keyup', e => {
  e.stopPropagation()
  let val = e.target.value
  let id = e.target.id
  showMenu(chufang, val, id);
})

$('#search-chufang.dropdown-input').click(e => {
  e.stopPropagation();
  var val = e.target.value
  var id = e.target.id
  showMenu(chufang, val, id);
})