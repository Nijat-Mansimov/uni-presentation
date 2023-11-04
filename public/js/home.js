jQuery(document).ready(function($) {
    $("book").on('click', '.page', function() {
      $(this).addClass('past');
    });
    $("book").on('click', '.page.past', function() {
      $(this).removeClass('past');
    });
  });