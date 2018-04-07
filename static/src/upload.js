import showMenu from './dropdown.js'

let bingzheng = []

$("#yiy").change((e) => {
  $("#file-chosen").text(e.target.files[0].name)
})

$(document).ready(() => {
  getData()
})

function getData() {
  if (bingzheng.length > 0) {
    return
  }
  $.ajax({
    url: '/data/diseases',
  }).done(data => {
    bingzheng = data
    $("input#disease").val(bingzheng[0])
  }).fail(err => {
    if(err.status === 401) {
      alert(err.responseText)
      window.location.replace("/login")
    }
  })
}

// $("#run").click(function(e) {
//   e.preventDefault()
//   var data = new FormData($("#file-form")[0])
//   var xhr = new XMLHttpRequest()
//   if (xhr.upload) {
//     xhr.upload.addEventListener('progress', function(e) {
//       if (e.lengthComputable) {
//         $('#upload-progress').css({width: `${e.loaded * 100 / e.total}%` });
//       }
//     }, false);
//   }
//   xhr.open("POST", "/upload")
//   xhr.send(data)
// })

$("#run").click(e => {
  e.preventDefault()
  // show loading animation
  $(".loader-div").css("display", "block")
  $.ajax({
    url: "/disease",
    data: {
      disease: $("input#disease").val()
    }
  }).done(() => {
    window.location.replace("/panel")
  })
})

$('#disease.dropdown-input').on('keyup', e => {
  e.stopPropagation()
  let val = e.target.value
  let id = e.target.id
  showMenu(bingzheng, val, id);
})

$('#disease.dropdown-input').click(e => {
  e.stopPropagation();
  var val = e.target.value
  var id = e.target.id
  showMenu(bingzheng, val, id);
})