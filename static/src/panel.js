$(document).ready(() => {
  if (window.location.hash) {
    let hash = window.location.hash
    let page = hash.substr(6)
    $(`#${page}`).addClass("item-focus")
    $(hash).css("visibility", "visible")
  }
})

$("#page-wenzhen").ready(() => {
	$("#page-wenzhen").load("/wenzhen.html")
  if (!window.location.hash) {
    $("#wenzhen").addClass("item-focus")
    $("#page-wenzhen").css("visibility", "visible")
  }
})
$("#page-relation").ready(() => {
  $("#page-relation").load("/relation.html")
})
$("#page-jiansuo").ready(() => {
  $("#page-jiansuo").load("/jiansuo.html")
})
$("#page-chufang").ready(() => {
  $("#page-chufang").load("/chufang.html")
})
$("#page-tuijian").ready(() => {
  $("#page-tuijian").load("/tuijian.html")
})
$("#page-julei").ready(() => {
  $("#page-julei").load("/julei.html")
})
$("#page-about").ready(() => {
  $("#page-about").load("/about.html")
})
$("#menu-toggle").click(e => {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled")
})

$("#wenzhen").click(e => {
	$(".sidebar-item").removeClass("item-focus")
	$("#wenzhen").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-wenzhen").css("visibility", "visible")
})
$("#relation").click(e => {
  $(".sidebar-item").removeClass("item-focus")
  $("#relation").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-relation").css("visibility", "visible")
})
$("#jiansuo").click(e => {
  $(".sidebar-item").removeClass("item-focus")
  $("#jiansuo").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-jiansuo").css("visibility", "visible")
})
$("#chufang").click(e => {
  $(".sidebar-item").removeClass("item-focus")
  $("#chufang").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-chufang").css("visibility", "visible")
})
$("#tuijian").click(e => {
  $(".sidebar-item").removeClass("item-focus")
  $("#tuijian").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-tuijian").css("visibility", "visible")
})
$("#julei").click(e => {
  $(".sidebar-item").removeClass("item-focus")
  $("#julei").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-julei").css("visibility", "visible")
})
$("#about").click(e => {
	$(".sidebar-item").removeClass("item-focus")
	$("#about").addClass("item-focus")
  $(".page-content").css("visibility", "hidden")
  $("#page-about").css("visibility", "visible")
})

$("#back-btn").click(e => {
  e.preventDefault()
  window.location.replace("/main")
})