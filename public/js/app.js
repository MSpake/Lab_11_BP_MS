'use strict';

let route = $('.book-data').attr('action');

if (route === '/save_to_library') {
  $('.book-data').toggle();
  $('.hidden-on-save').toggle();
}

if (route.includes('books')) {
  //change hidden input _method value to put or delete
  $('#update').on('click', event => {
    $('.book-data').toggle();
    $('#update').toggle();
    $('#delete').toggle();
    $('input[name=\'_method\']').val('put');
    $('input[name=\'submit\']').val('Update');
  })

  $('#delete').on('click', event => {
    $('.book-data').toggle();
    $('#update').toggle();
    $('#delete').toggle();
    $('.hidden-on-delete').toggle();
    $('input[name=\'_method\']').val('delete');
    $('input[name=\'submit\']').val('Yes, Delete');
    $('input[name=\'submit\']').before('<p>Are you sure you want to delete this book?</p>');

  })
}
