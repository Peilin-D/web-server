"use strict";

$(document).ready(function () {
  if (window.location.hash) {
    var hash = window.location.hash;
    var page = hash.substr(6);
    $("#" + page).addClass("item-focus");
    $(hash).css("visibility", "visible");
  }
});

$("#page-wenzhen").ready(function () {
  $("#page-wenzhen").load("/wenzhen.html");
  if (!window.location.hash) {
    $("#wenzhen").addClass("item-focus");
    $("#page-wenzhen").css("visibility", "visible");
  }
});
$("#page-relation").ready(function () {
  $("#page-relation").load("/relation.html");
});
$("#page-jiansuo").ready(function () {
  $("#page-jiansuo").load("/jiansuo.html");
});
$("#page-chufang").ready(function () {
  $("#page-chufang").load("/chufang.html");
});
$("#page-tuijian").ready(function () {
  $("#page-tuijian").load("/tuijian.html");
});
$("#page-julei").ready(function () {
  $("#page-julei").load("/julei.html");
});
$("#page-about").ready(function () {
  $("#page-about").load("/about.html");
});
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

$("#wenzhen").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#wenzhen").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-wenzhen").css("visibility", "visible");
});
$("#relation").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#relation").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-relation").css("visibility", "visible");
});
$("#jiansuo").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#jiansuo").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-jiansuo").css("visibility", "visible");
});
$("#chufang").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#chufang").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-chufang").css("visibility", "visible");
});
$("#tuijian").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#tuijian").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-tuijian").css("visibility", "visible");
});
$("#julei").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#julei").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-julei").css("visibility", "visible");
});
$("#about").click(function (e) {
  $(".sidebar-item").removeClass("item-focus");
  $("#about").addClass("item-focus");
  $(".page-content").css("visibility", "hidden");
  $("#page-about").css("visibility", "visible");
});

$("#back-btn").click(function (e) {
  e.preventDefault();
  window.location.replace("/main");
});