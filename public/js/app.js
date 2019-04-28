'use strict';


//works
//console logs to page
console.log($('.book-data').attr('action'));


let route = $('.book-data').attr('action');

switch (route) {
case '/save_to_library':
  console.log(route + ' from switch');
  $('.book-data').toggle();
  $('.hidden-on-save').toggle();
  break;
case '/update':
  console.log(route + ' from switch');
  $('#update').on('click', event => {
    $('.book-data').toggle();
    $('input[name=\'submit\']').val('Update');

  })
  break;

}
