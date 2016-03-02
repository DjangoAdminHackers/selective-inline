/*
 Small js object for managing django formsets

 new djangoFormset({
     'prefix': 'form',
     'empty_form': $('.empty-form'),
     'group_container_class': 'group_container',
     'form_container_class': 'form_container',
     'del_form_link_class': 'remove_form',
     'add_form_link': $('#add_form'),
     'empty_form_class': 'empty_form',
     'postFormAdd': function(new_form, obj){ ... },
     'postFormDelete': function(obj){ ... }
 });
 */
var djangoFormset = (function($){

    var formset = function(options){
        this.options = $.extend({}, this.default_options, options);
        this.init();
    };

    $.extend(formset.prototype, {
        default_options: {
            'prefix': 'form',
            'empty_form_class': 'empty_form'
        },

        init: function(){
            var self = this;
            self.id_regex = new RegExp("(" + self.options.prefix + "-(\\d+|__prefix__))");
            self.total_forms_el = self.options.total_forms_el || $('#id_' + self.options.prefix + '-TOTAL_FORMS');
            self.max_forms_el = self.options.max_forms_el || $('#id_' + self.options.prefix + '-MAX_NUM_FORMS');

            $('body').on('click', '.' + self.options.del_form_link_class, function(e){
                self.remove_form($(this), e);
                e.preventDefault();
                return false;
            });

            if(self.options.add_form_link){
                self.options.add_form_link.click(function(e){
                    self.add_form($(this), e);
                    e.preventDefault();
                    return false;
                });
            }
        },

        remove_form: function(link, event){
            var self = this,
                target_form = link.closest('.' + self.options.form_container_class);

            target_form.nextAll('.' + self.options.form_container_class).each(function(index, el){
                self.set_new_form_index($(el), null);
            });

            target_form.remove();
            self.total_forms_el.val(parseInt(self.total_forms_el.val()) - 1);
            if(self.options.postFormDelete){
                self.options.postFormDelete(self);
            }
        },

        add_form: function(link, event) {
            var self = this,
                forms_count = parseInt(self.total_forms_el.val());

            if (self.max_forms_el.val() && forms_count >= parseInt(self.max_forms_el.val())) {
                return;
            }

            var new_form = self.options.empty_form.clone().removeAttr('id');

            self.set_new_form_index(new_form, parseInt(self.total_forms_el.val()));

            self.total_forms_el.val(parseInt(self.total_forms_el.val()) + 1);

            new_form.insertBefore(self.options.empty_form)
                .removeClass(self.options.empty_form_class)
                .addClass(self.options.form_container_class);

            if (self.options.postFormAdd) {
                self.options.postFormAdd(new_form, self);
            }
            return new_form;
        },

        set_new_form_index: function(form, index){
            var self = this;

            form.find(':input').each(function(i, el){
                var $el = $(el);
                if(index == null){
                    index = self.id_regex.exec($el.attr('name')).pop() - 1;
                }
                $el.attr('id', $el.attr('id').replace(self.id_regex, self.options.prefix + '-' + index ));
                $el.attr('name', $el.attr('name').replace(self.id_regex, self.options.prefix + '-' + index ));
            });

            form.find('label').each(function(i, el){
                var $el = $(el);
                if($el.attr('for')){
                    if(index == null){
                        index = self.id_regex.exec($el.attr('for')).pop() - 1;
                    }
                    $el.attr('for', $el.attr('for').replace(self.id_regex, self.options.prefix + '-' + index ));
                }
            });
            form.data('form-num', index);
        },

        decrease_form_index: function(form, removed_index){
            var self = this,
                index = null;

            form.find(':input').each(function(i, el){
                var $el = $(el);
                index = self.id_regex.exec($el.attr('name')).pop();
                if(index > removed_index){
                    index --;
                    $el.attr('id', $el.attr('id').replace(self.id_regex, self.options.prefix + '-' + index ));
                    $el.attr('name', $el.attr('name').replace(self.id_regex, self.options.prefix + '-' + index ));
                }
            });

            form.find('label').each(function(i, el){
                var $el = $(el);
                if($el.attr('for')){
                    index = self.id_regex.exec($el.attr('for')).pop();
                    if(index > removed_index){
                        index --;
                        $el.attr('for', $el.attr('for').replace(self.id_regex, self.options.prefix + '-' + index ));
                    }
                }
            });
            form.data('form-num', index);
        }

    });

    return formset;
})(django.jQuery);
