// Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
$.widget.bridge('uibutton', $.ui.button);

$(function () {
  $('[data-toggle="popover"]').popover();
});

$(document).ready(function () {
  //File input
  bsCustomFileInput.init();
});