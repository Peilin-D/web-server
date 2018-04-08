'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = showMenu;
$(document).click(function () {
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', 0);
});

function create(item, id) {
  var elem = $('<button class=\'dropdown-item\' type=\'button\'>' + item + '</button>');
  elem.click(function () {
    $('#' + id + '.dropdown-input').val(item);
    $('.scrollable-menu').empty();
  });
  return elem;
}

function showMenu(original, currenVal, id) {
  var filtered = filter(original, currenVal);
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', $('.dropdown-input').outerWidth());
  var elems = [];
  for (var i = 0; i < filtered.length; i++) {
    elems.push(create(filtered[i], id));
  }
  $('#' + id + '.scrollable-menu').append(elems);
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

function filter(original, currentVal) {
  if (currentVal === '') {
    return original;
  } else {
    return original.filter(function (d) {
      return d.startsWith(currentVal);
    });
  }
}