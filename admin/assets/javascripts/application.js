! function($) {
  'use strict';

  $(function() {
    function toggleAction(selector, disabled) {
        var method = disabled ? 'addClass' : 'removeClass';
        $(selector)[method]('list-menu-link-disabled')
          .parent()[method](
            'list-menu-wrapper-disabled');
      }
      // Check/uncheck all functionality
    function checkAll(base, checked) {
      // Toggle all checkboxes on the table's body that exist on the first column.
      base.find(listCheckboxesSelector)
        .prop('checked', checked);
      base.find('.list-row')[checked ? 'addClass' : 'removeClass'](
        'list-row-selected');
      toggleAction('#delete-selected', !checked);
    }

    function generalToggle() {
      var checked = listCheckboxes.filter(':checked')
        .length;
      toggleAction('#delete-selected', checked === 0);
      toggleAction('#deselect-all', checked === 0);
      toggleAction('#select-all', checked === listCheckboxesLength);
    }

    var listCheckboxesSelector = '.list-selectable-checkbox',
      list = $('#list'),
      listCheckboxes, listCheckboxesLength;


    // Only process list-related JavaScript if there's a list!
    if (list.length > 0) {
      listCheckboxes = list.find(listCheckboxesSelector);
      listCheckboxesLength = listCheckboxes.length;

      // Confirm before deleting one item
      $('.list-row-action-delete-one')
        .on('click', function(ev) {
          ev.preventDefault();
          $(this)
            .addClass('list-row-action-wrapper-link-active')
            .siblings('.list-row-action-popover-delete-one')
            .first()
            .show()
            .find('.cancel')
            .on('click', function() {

              $(this)
                .parents('.list-row-action-popover-delete-one')
                .hide()
                .siblings('.list-row-action-delete-one')
                .removeClass(
                  'list-row-action-wrapper-link-active');
            });
        });

      // Select/deselect record on row's click
      list.find('.list-row')
        .on('click', function(ev) {
          var checkbox, willBeChecked;
          ev.stopPropagation();

          if (ev.currentTarget.tagName == 'TR') {
            checkbox = $(this)
              .find('.list-selectable-checkbox');
            willBeChecked = !checkbox.prop('checked');
            checkbox.prop('checked', willBeChecked);
            $(this)[willBeChecked ? 'addClass' : 'removeClass'](
              'list-row-selected');
            generalToggle();
          }
        });
      // Select all action
      $('#select-all')
        .on('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if ($(this)
            .is('.list-menu-link-disabled')) return;

          // We assume we want to stay on the dropdown to delete all perhaps
          ev.stopPropagation();
          checkAll(list, true);
          toggleAction('#select-all', true);
          toggleAction('#deselect-all', false);
        });
      // Deselect all action
      $('#deselect-all')
        .on('click', function(ev) {
          ev.preventDefault();
          if ($(this)
            .is('.list-menu-link-disabled')) return;

          checkAll(list, false);
          toggleAction('#deselect-all', true);
          toggleAction('#select-all', false);
        });
      // Delete selected
      $('#delete-selected')
        .on('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if ($(this)
            .is('.list-menu-link-disabled')) return;

          // Open the popup to confirm deletion
          $(this)
            .parent()
            .addClass('active')
            .parent('.dropdown')
            .addClass(
              'open');
          $(this)
            .addClass('active')
            .siblings('.list-menu-popover-delete-selected')
            .first()
            .show()
            .find('.cancel')
            .on('click', function() {

              // Hide the popover on cancel
              $(this)
                .parents('.list-menu-popover-delete-selected')
                .hide()
                .siblings('#delete-selected')
                .removeClass('active')
                .parent()
                .removeClass('active');
              // and close the dropdown
              $(this)
                .parents('.dropdown')
                .removeClass('open');
            });

          $(this)
            .siblings('.list-menu-popover-delete-selected')
            .find(
              ':hidden[data-delete-many-ids=true]')
            .
          val(listCheckboxes.filter(':checked')
            .map(function() {
              return $(this)
                .val();
            })
            .toArray()
            .join(','));
        });

      // Catch checkboxes check/uncheck and enable/disable the delete selected functionality
      listCheckboxes.on('click', function(ev) {
        ev.stopPropagation();

        $(this)
          .parent('.list-row')[$(this)
            .is(':checked') ? 'addClass' :
            'removeClass']('list-row-selected');

        generalToggle();
      });
    }

    // Autofocus first field with an error. (usability)
    var error_input;
    if (error_input = $('.has-error :input')
      .first()) {
      error_input.focus();
    }

    //apply re-order to .reorderable lists
    $('ul.reorderable.category-child-order')
      .sortable({
        cursor: "move",
        placeholder: "sortable-placeholder",
        connectWith: ".category-all-order",
        dropOnEmpty: true,
        update: function(event, ui) {
          var new_order = new Array;
          var cur_idx = 0;
          $(this)
            .children()
            .each(function() {
              post_url = $(this)
                .attr("data-update-url");
              console.log($(this)
                .attr("data-id"));
              new_order.push($(this)
                .attr("data-id"));
              $.post($(this));
              cur_idx++;
            });
          console.log("New Order: ", new_order);
        }
      });
    $('ul.reorderable.category-all-order')
      .sortable({
        connectWith: ".category-child-order",
        dropOnEmpty: true
      });
    $(".reorderable")
      .disableSelection();


    //the following is for tagsinput typeahead
    $('.tag-list-for-post')
      .tagsinput('input')
      .typeahead({
        prefetch: '/posts/tags.json'
      })
      .bind('typeahead:selected', $.proxy(function(obj, datum) {
        this.tagsinput('add', datum);
        this.tagsinput('input')
          .typeahead('setQuery', '');
      }, $('input')));


    $('select#post_editor_select')
      .on('change', function() {
        var selected = $(this).val();
        var editor_pane = $('.post-editors .post-editor[name="' +
          selected + '"]');
        $('.post-editors .post-editor').addClass('hidden')
        $('.post-editors .post-editor :input').attr('disabled',
          'disabled');
        editor_pane.removeClass('hidden');
        editor_pane.find(':input').removeAttr('disabled')
      });
    $('.post-editors .post-editor :input').attr('disabled', 'disabled');
    $('select#post_editor_select').change();
  });
}(window.jQuery);
