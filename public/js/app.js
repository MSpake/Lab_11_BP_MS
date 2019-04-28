'use strict';

let route = $('.book-data').attr('action');

switch (route) {
case '/save_to_library':
  $('.book-data').toggle();
  $('.hidden-on-save').toggle();
  break;
case '/update':
  //add hidden input _method of PUT
  $('#update').on('click', event => {
    $('.book-data').toggle();
    $('#update').toggle();
    $('input[name=\'submit\']').val('Update');
  })
  break;

}
