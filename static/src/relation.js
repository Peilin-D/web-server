$("#medicines").ready(() => {
  $.ajax({
    url: "/data/medicines"
  }).done(meds => {
    let i = 0
    while(i < meds.length) {
      $("#medicines tbody").append(`<tr id="tr${i}"></tr>`)
      let j = i
      while(j < i + 8 && j < meds.length) {
        $(`#tr${i}`).append(`
          <td>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="${j}" checked>
              <label class="form-check-label" for="${j}">
              ${meds[j]}
              </label>
            </div>
          </td>
        `)
        j++
      }
      i = j
    }
  })
})


$("#submit-relation").click(e => {
  e.preventDefault()
  $("#grouped").empty()
  $("#graph").empty()
  $("#scatter").empty()
  $("#parallel-coord").empty()
  $("#matrix").empty()
  $("#itemfreq").empty()
  $("#relation-table").empty()
  let meds = $("#medicines input:checked").map(function () {
    return $(this).attr('id')
  }).get()
  $.ajax({
    url: "/relation",
    data: {
      medsChosen: meds,
      numClusters: $("#num-clusters").val(),
      supp: $("#support").val(),
      conf: $("#confidence").val(),
      sort: $("#sort").val() === "概率" ? "lift" : $("#sort").val() === "支持度" ? "support" : "confidence",
      min:  $("#min").val(),
      max:  $("#max").val()
    }
  }).done(data => {
  	let path = data[0]
  	$("#grouped").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[0]}?${new Date().getTime()}>`)
  	$("#graph").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[1]}?${new Date().getTime()}>`)
  	$("#scatter").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[2]}?${new Date().getTime()}>`)
  	$("#parallel-coord").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[3]}?${new Date().getTime()}>`)
  	$("#matrix").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[4]}?${new Date().getTime()}>`)
  	$("#itemfreq").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${path[5]}?${new Date().getTime()}>`)
	
  	let table = data[1]
  	let headers = table[0]
	$("#relation-table").append("<thead></thead>")
	$("#relation-table").append("<tbody></tbody>")
    $("#relation-table thead").append("<tr></tr>")
    headers.forEach(h => {
    	$("#relation-table thead tr").append(`<th>${h}</th>`)
    })
    for (let i = 1; i < table.length; i++) {
      let row = ""
      table[i].forEach(elem => {
        row += `<td>${elem}</td>`        //creat data cells for the table
      })
      $("#relation-table tbody").append(`<tr>${row}</tr>`)        //create a row for the table
    }
  })
})

var slider_clusters = $("#num-clusters").slider({
  tooltip: 'always'
});

var slider_supp = $("#support").slider({
  tooltip: 'always'
});

var slider_conf = $("#confidence").slider({
  tooltip: 'always'
});

slider_clusters.on("change", () => {
  $("#num-clusters-val").val(slider_clusters.slider('getValue'))
})

slider_supp.on("change", () => {
  $("#support-val").val(slider_supp.slider('getValue'))
})

slider_conf.on("change", () => {
  $("#confidence-val").val(slider_conf.slider('getValue'))
})
