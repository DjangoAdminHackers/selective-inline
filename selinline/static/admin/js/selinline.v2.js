($ || django.jQuery)(function($){

    $(document).ready(function($) {
        
        $('.selective-inline-group').each(function() {

            function setTitleContainerHeight(el) {
                
                var fieldsetHeight = $(el).parent().find('.selinline-inner').outerHeight();
                var titlesHeight = el.closest("ul").outerHeight();
                
                var newHeight = Math.max(fieldsetHeight, titlesHeight);

                el.closest('.selective-inline-titles').height(newHeight);
                el.parent().find('.inline-related').height(newHeight);
                el.parent().find('.inline-related').css({'max-height': newHeight});
                
            }
            
            setTitleContainerHeight($(this).find('.title-holder'));

            var prefix = $(this).data("prefix");
            var titleContainer = $('#' + prefix + '-titles').children('ul');

            var isOrderable = $(this).data("is-orderable");
            var auto_orderable_field = $(this).data("auto-orderable-field");

            var formset = new djangoFormset({
                'prefix': prefix,
                'empty_form': titleContainer.find('.empty-title'),
                'group_container_class': 'selective-inline-group',
                'form_container_class': 'selective-inline-item',
                'del_form_link_class': 'remove-container',
                'add_form_link': $('#' + prefix + '-inline-add'),
                'empty_form_class': 'empty-title',
                'postFormAdd': function (new_form, obj) {
                    var index = parseInt(obj.total_forms_el.val());
                    new_form.find('.title-holder .counter').text(index).click();
                    // trigger 'formset:added' event for autocomplete
                    $(document).trigger('formset:added', [new_form, prefix]);
                    setTitleContainerHeight(new_form.find('.title-holder'));
                },
                'postFormDelete': function (obj) {
                    titleContainer.children().each(function (i, el) {
                        var $el = $(el);
                        if ($el.data('form-num')) {
                            $el.find('.counter').text(parseInt($el.data('form-num')) + 1);
                            setTitleContainerHeight($el.find('.title-holder'));
                        }
                    });
                }
            });

            $(titleContainer).delegate('.selective-inline-item > .title-holder', 'click', function (e) {
                titleContainer.children('.active-title').removeClass('active-title');
                $(this).parent().addClass('active-title');
                setTitleContainerHeight($(this));
            });

            $(titleContainer).find('.mark-deleted').click(function (e) {
                e.preventDefault();
                $(this)
                    .closest('.selective-inline-item')
                    .addClass('deleted')
                    .find('span.delete')
                    .children('input')
                    .prop('checked', 'checked');
                return false;
            });

            $(titleContainer).find('.restore-link').click(function (e) {
                e.preventDefault();
                $(this)
                    .closest('.selective-inline-item').removeClass('deleted')
                    .find('span.delete').children('input').removeProp('checked');
                return false;
            });

            $('#' + prefix + '-titles li:first-child .title-holder').click();

            if (isOrderable) {
                // bug fix. If .empty-title .inline-related has any height, the sortable keeps flickering
                $('.empty-title .inline-related', titleContainer).height(1)

                titleContainer.sortable({
                    placeholder: "sortable-placeholder",
                    axis: "y",
                    containment: "parent",
                    "cursorAt": {top: 5},
                    forceHelperSize: true,
                    tolerance: "pointer",
                    handle: '.selective-grab-holder',
                    helper: function () {
                        return $('<div class="dragged-clone"></div>');
                    },
                    start: function (event, ui) {
                        // remove the mce widgets within the sortable item
                        $(ui.item).find('.mce_inited').each(function(i){
                            var text_id = $(this).attr('id');
                            $('#' + text_id).removeClass('mce_inited').addClass('mce_fields');
                            tinyMCE.get(text_id).remove();
                        })
                    },
                    stop: function (event, ui) {
                        titleContainer.children().each(function (i, el) {
                            $(el).find('.orderable-input').val(i);
                        });
                        // re-init the mce widgets within the sortable item
                        $(ui.item).find('.mce_fields').each(function(i){
                            var text_id = $(this).attr('id');
                            var field_tinyMCE_config = $('#' + text_id).data('mceConf');
                            tinymce.init(field_tinyMCE_config);
                            $('#' + text_id).removeClass('mce_fields').addClass('mce_inited');
                        })
                    }
                });

                var max_order = 0;

                titleContainer.children().each(function (i, el) {
                    var order_el = $(el).find('.orderable-input');
                    var order_val = parseInt(order_el.val() || 0);
                    if (order_val) {
                        if (order_val > max_order) {
                            max_order = order_val;
                        }
                    } else {
                        max_order++;
                        order_el.val(max_order);
                    }
                });

                if(auto_orderable_field){
                    var button_id = prefix + 'auto_orderable_button';
                    var button_text = 'Auto Sort';
                    $(this).find('h2').append(' (<a href="#" id="' + button_id + '" class="button">' + button_text + '</a>)')
                    $('#' + button_id).click(function(e) {
                        e.preventDefault()
                        var mylist = titleContainer;
                        var listitems = titleContainer.children('li').get();
                        listitems.sort(function(a, b) {
                            var compA = $('.field-' + auto_orderable_field, a).find('p').text();
                            var compB = $('.field-' + auto_orderable_field, b).find('p').text();
                            diff = (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
                            if(diff == 0){
                                compA = $('.orderable-input', a).val();
                                compB = $('.orderable-input', b).val();
                                diff = (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
                            }
                            return diff
                        });
                        $.each(listitems, function(i, el) {
                            mylist.append(el);
                            $(el).find('.orderable-input').val(i);
                        });
                        $(titleContainer).sortable("refresh");
                    });
                }
                
            }
        });
    })
})