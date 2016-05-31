($ || django.jQuery)(function($){

    $(document).ready(function($) {
        
        $('.selective-inline-group').each(function() {

            function setTitleContainerHeight(el) {
                var inlineHeight = $(el).parent().find('.inline-related').height();
                var selectiveInlineHeight = el.closest("ul").height();
                var maxHeight = Math.max(inlineHeight, selectiveInlineHeight);
                el.closest('.selective-inline-titles').css({'height': maxHeight});
            }

            var prefix = $(this).data("prefix");
            var titleContainer = $('#' + prefix + '-titles').children('ul');

            var isOrderable = ($(this).data("is-orderable") === 'true');

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
                    },
                    stop: function (event, ui) {
                        titleContainer.children().each(function (i, el) {
                            $(el).find('.orderable-input').val(i);
                        });
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
            }
        });
    })
})