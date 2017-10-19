$(function(){

  'use strict';


  var table, originData, originPrefixes, _data = [];
  var showImages = false;
  var rowsLength = 10;

  $(document).on('userUpdated', function() {
    var $loginForm = $('.j-login-form');
    var $logoutLink = $('.j-logout-link');

    var user = JSON.parse(sessionStorage.getItem('user'));
    var url = '/price.json';
    //var url = '/price__.json';

    if (user && user.hasOwnProperty('role')) {
      url = '/price' + user.role + '.json';
    }

    console.log(url);

    $.ajax({url:url}).then(function(data) {
      data = JSON.parse(data);
      originData = data.data;
      originPrefixes = data.prefixes;
      _data = originData;

      initDataTable(_data, originPrefixes);
      renderCategories(originData);

   },
   function(data) {
    alert( "get failed!");

});

    if (user && user.hasOwnProperty('username')) {
      $loginForm.hide();
      $logoutLink.show();
      $logoutLink.find('strong').html(user.username);
    }

    else {
      $loginForm.show();
      $logoutLink.hide();
    }
  }).trigger('userUpdated');

  // инициализация плагина
  $.jqCart({
    buttons: '.add_item',
    handler: '/handler.php',
    cartLabel: '.label-place',
    visibleLabel: true,
    openByAdding: false,
    currency: '₽' //указание валюты
  });


  $('#category-list').on('click', 'a', function(ev) {
    ev.preventDefault();

    _data = [];
    var $link = $(this);
    var cat = $link.data('cat');

    $('#category-list a').removeClass('is-active');
    $link.addClass('is-active')

    if (cat == 0) _data = originData;

    originData.forEach(function(v) {
      if (v[9] == cat) _data.push(v)
    });

    initDataTable(_data, originPrefixes);
  });

  $('#category-toggle').on('click', function() {
    var $button = $(this);
    var $span = $button.find('span');
    var text = $button.hasClass('is-hidden') ? 'Cкрыть' : 'Показать';

    $button.toggleClass('is-hidden');
    $('#category-list').fadeToggle(0);

    $span.html(text);
  });

  $('#show-images').on('click', function() {
    var $button = $(this);
    var $span = $button.find('span');
    var text;

    showImages = !showImages;
    text = showImages ? 'Cкрыть' : 'Отобразить';

    $span.html(text);

    initDataTable(_data, originPrefixes);
  });

  function renderCategories(data) {
    var values = [];
    var $list = $('#category-list');

    data.forEach(function(v) {
      var cat = v[9];

      if (values.indexOf(cat) == -1) {
        values.push(cat)
      }
    });

    values.forEach(function(v) {
      $list.append('<li><a href="" data-cat="' + v + '">' + v + '</a></li>');
    })
  }

  function initDataTable(data, prefixes) {
    if (table) {
      table.destroy();
    }


    var __data = [];

    data.forEach(function(d, i) {

      var urlregex = new RegExp("^\/(.*)"); //регулярное выражение не проверку
      if(d[2])
      {
        if(urlregex.test(d[2]))
        {
          d[2] = '<a href="' + prefixes[0] + d[2] + '" target="_blank">Подробнее</a>';
        }
      }
      if(d[10])
      {
          d[10] = prefixes[1] + d[10];
      }
      __data[i] = d;
    });


    table = $('#btt').DataTable( {
      'language': { url: '/js/russian.json' },
      'data': data,
      'processing': true,	//Показывает процесс обработки
      'deferRender': true,
      'sort': false,  //Отключение сортировки
      'columnDefs': [
        { 'targets': 0 },
        { 'targets': 2 },
        { 'data': null, 'defaultContent': "<div class='hm--spinner'><i class='dec'>◀</i><input type='number' class='item_count num'></input><i class='inc'>▶</i></div>", 'targets': 5},
        { 'data': null, 'defaultContent': "<button class='add_item no' disabled='disabled'>Заказать</button>", 'targets': -1 } // создать кнопку в последнем столбце
      ],
      'columns': [
        { 'searchable': true, 'class': "item_id" },
        { 'searchable': true, 'class': "item_title" },
        { 'searchable': false, 'class': "item_descr" },
        { 'searchable': false },
        { 'searchable': false, 'class': "item_price", 'type': "numeric" },
        { 'searchable': false },
        { 'searchable': false, 'type': "numeric", 'class': "item_sum" },
        { 'searchable': false, class: 'j-min' },
        { 'searchable': false },
      ],

      createdRow: function( row, data, dataIndex ) { // присваиваем класс строке
        var $row = $(row);
        var $input = $row.find('input[type="number"]');

        var image = data[10];
        var descr = data[2];

        $row.addClass( 'item_box').attr('id', data[0])

        if (image) (function() {
            var $title = $row.find('.item_title')
            var html = $title.html();
            var $imageLink = $('<a href="' + image + '" rel="' + data[0] + '" class="j-swipebox">' + html + '</a>');

            $title.empty().html($imageLink);
        })()

        /*if (descr) (function() {
          var $descr = $row.find('.item_descr')
          var $descrLink = $('<a href="' + descr + '" target="_blank">Подробнее</a>');;

          $descr.empty().html($descrLink);
        })()*/

        $input.attr('step', $row.find('td.j-min').html() || 1);
      },

      drawCallback: function() {
        var $table = $('.hm--data-table');

        if (!$table.closest('.hm--data-table-wrap').length) {
          $table.wrap('<div class="hm--data-table-wrap">');
        }

        $('.j-swipebox').swipebox();
      }
    });
  }

  $('#clear-category').on('click', function() {
    $('#category-list a').removeClass('is-active');

    _data = originData;

    initDataTable(_data, originPrefixes);
  });

  $("a.toggle-vis").on( "click", function (e) {
    e.preventDefault();
    var column = table.column( $(this).attr("data-column") );
    column.visible( ! column.visible() );
  } );

  $('#btt tbody input.num').keydown(function(event) {
    // Разрешаем нажатие клавиш backspace, Del, Tab и Esc
    if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
      // Разрешаем выделение: Ctrl+A
      (event.keyCode == 65 && event.ctrlKey === true) ||
      // Разрешаем клавиши навигации: Home, End, Left, Right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }	else {
      // Запрещаем всё, кроме клавиш цифр на основной клавиатуре, а также Num-клавиатуре
      if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
        event.preventDefault();
      }
    }
  });

  $(document).on('click.hm--spinner', '.hm--spinner i', function() {
    var $arrow = $(this);
    var $input = $arrow.closest('.hm--spinner').find('input');
    var val = Number($input.val());
    var step = Number($input.attr('step'));
    var incVal = val + step;
    var decVal = val - step;

    if ($arrow.hasClass('inc')) {
      $input.val(incVal)
    }

    else {
      if (decVal < 0) return $input.val(null);
      $input.val(decVal);
    }

    setTimeout(function() {
      $input.trigger('input');
    }, 100);
  });

  (function() {
    var firstRowId = false;
    var page;

    $(document).on('input.search-filter', '#btt_filter input[type="search"]', function() {
      var $input = $(this);

      if ($input.val().length) {
        firstRowId = $('#btt tbody tr:first').attr('id');;
      }

      else {
        _data.forEach(function(v, k) {
          if (v[0] == firstRowId) {
            page = parseInt(k / table.page.len());
            page = page > 0 ? page : 1;

            table.page(page).draw('page');
          }
        })
      }
    });
  }());


  $(document).on('change.rows-length', 'select[name="btt_length"]', function() {
    rowsLength = Number($(this).val());
  })
});
