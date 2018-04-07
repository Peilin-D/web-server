import setList from './dropdown.js'

// polyfill startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

let bingzheng = []

$("#yiy").change((e) => {
  $("#file-chosen").text(e.target.files[0].name)
})

$(document).ready(() => {
  getData()
})

function getData() {
  if (bingzheng.length > 0) {
    setList(bingzheng)
    return
  }
  $.ajax({
    url: '/data/diseases',
  }).done(data => {
    bingzheng = data
    setList(data)
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
  // $(".loader-div").toggleClass("loader")
  $.ajax({
    url: "/disease",
    data: $("input#disease").val()
  }).done(() => {
    window.location.href = "/panel"
  })
})