"use strict";

$("#medicines").ready(function () {
  $.ajax({
    url: "data/medicines"
  }).done(function (meds) {
    var i = 0;
    while (i < meds.length) {
      $("#medicines tbody").append("<tr id=\"tr" + i + "\"></tr>");
      var j = i;
      while (j < i + 8 && j < meds.length) {
        $("#tr" + i).append("\n          <td>\n            <div class=\"form-check form-check-inline\">\n              <input class=\"form-check-input\" type=\"checkbox\" id=\"" + j + "\" checked>\n              <label class=\"form-check-label\" for=\"" + j + "\">\n              " + meds[j] + "\n              </label>\n            </div>\n          </td>\n        ");
        j++;
      }
      i = j;
    }
  });
});

$("#submit-relation").click(function (e) {
  e.preventDefault();
  $("#grouped").empty();
  $("#graph").empty();
  $("#scatter").empty();
  $("#parallel-coord").empty();
  $("#matrix").empty();
  $("#itemfreq").empty();
  $("#relation-table").empty();
  var meds = $("#medicines input:checked").map(function () {
    return $(this).attr('id');
  }).get();
  $.ajax({
    url: "/relation",
    data: {
      medsChosen: meds,
      numClusters: $("#num-clusters").val(),
      supp: $("#support").val(),
      conf: $("#confidence").val(),
      sort: $("#sort").val() === "概率" ? "lift" : $("#sort").val() === "支持度" ? "support" : "confidence",
      min: $("#min").val(),
      max: $("#max").val()
    }
  }).done(function (data) {
    var path = data[0];
    $("#grouped").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[0] + "?" + new Date().getTime() + ">");
    $("#graph").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[1] + "?" + new Date().getTime() + ">");
    $("#scatter").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[2] + "?" + new Date().getTime() + ">");
    $("#parallel-coord").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[3] + "?" + new Date().getTime() + ">");
    $("#matrix").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[4] + "?" + new Date().getTime() + ">");
    $("#itemfreq").append("<img id=\"grouped_plot\" style=\"width:600px;height:500px;\" src=" + path[5] + "?" + new Date().getTime() + ">");

    var table = data[1];
    var headers = table[0];
    $("#relation-table").append("<thead></thead>");
    $("#relation-table").append("<tbody></tbody>");
    $("#relation-table thead").append("<tr></tr>");
    headers.forEach(function (h) {
      $("#relation-table thead tr").append("<th>" + h + "</th>");
    });
    for (var i = 1; i < table.length; i++) {
      var row = "";
      table[i].forEach(function (elem) {
        row += "<td>" + elem + "</td>"; //creat data cells for the table
      });
      $("#relation-table tbody").append("<tr>" + row + "</tr>"); //create a row for the table
    }
  });
});

var slider_clusters = $("#num-clusters").slider({
  tooltip: 'always'
});

var slider_supp = $("#support").slider({
  tooltip: 'always'
});

var slider_conf = $("#confidence").slider({
  tooltip: 'always'
});

slider_clusters.on("change", function () {
  $("#num-clusters-val").val(slider_clusters.slider('getValue'));
});

slider_supp.on("change", function () {
  $("#support-val").val(slider_supp.slider('getValue'));
});

slider_conf.on("change", function () {
  $("#confidence-val").val(slider_conf.slider('getValue'));
});