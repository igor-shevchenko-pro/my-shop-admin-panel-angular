$(function () {
  //Initialize Select2 Elements
  $('.select2').select2();

  //Initialize Select2 Elements
  $('.select2bs4').select2({
    theme: 'bootstrap4'
  });

  //File input
  $(document).ready(function () {
    bsCustomFileInput.init();
  });
});
