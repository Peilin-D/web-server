$("#medicines").ready(() => {
  $.ajax({
    url: "data/medicines"
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
    // display images here
	$("#grouped").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[0]}?${new Date().getTime()}>`)
	$("#graph").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[1]}?${new Date().getTime()}>`)
	$("#scatter").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[2]}?${new Date().getTime()}>`)
	$("#parallel-coord").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[3]}?${new Date().getTime()}>`)
	$("#matrix").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[4]}?${new Date().getTime()}>`)
	$("#itemfreq").append(`<img id="grouped_plot" style="width:600px;height:500px;" src=${data[5]}?${new Date().getTime()}>`)
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
