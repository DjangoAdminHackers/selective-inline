### -*- coding: utf-8 -*- ###
try:
    from django.contrib.admin.utils import flatten_fieldsets
except ImportError:
    from django.contrib.admin.util import flatten_fieldsets

from django.db import models
from django import forms
from django.utils import six
from django.contrib.admin.options import InlineModelAdmin


# django 1.5 compability hook
try:
    from django.contrib.admin.options import RenameBaseModelAdminMethods
    base_meta_class = RenameBaseModelAdminMethods
except ImportError:
    base_meta_class = forms.MediaDefiningClass


class OrderableDefiningClass(base_meta_class):
    def __new__(cls, name, bases, attrs):
        new_class = super(OrderableDefiningClass, cls).__new__(cls, name, bases, attrs)
        if attrs.get('orderable_field') and getattr(new_class, 'form', forms.ModelForm) == forms.ModelForm:
            parent = (object,)
            Meta = type(str('Meta'),
                        parent,
                        {'widgets': {attrs['orderable_field']: forms.HiddenInput(attrs={'class': 'orderable-input'})}})
            new_class.form = type(forms.ModelForm)(str('OrderableModelForm'), (forms.ModelForm,), {
                'Meta': Meta,
                'show_orderable_field': lambda self: self[attrs['orderable_field']]
            })

            if 'ordering' not in attrs:
                new_class.ordering = (attrs['orderable_field'], )
        return new_class


class SelectiveInlineMixin(six.with_metaclass(OrderableDefiningClass)):
    template = 'admin/edit_inline/selective.html'
    orderable_field = None

    def __init__(self, *args, **kwargs):
        super(SelectiveInlineMixin, self).__init__(*args, **kwargs)

        if self.orderable_field:
            if self.orderable_field not in self.model._meta.get_all_field_names():
                raise AttributeError('%s model does not have "%s" field' % (self.model.__name__, self.orderable_field))
            if not issubclass(type(self.model._meta.get_field_by_name(self.orderable_field)[0]), models.IntegerField):
                raise AttributeError('"%s" field is not an integer one' % self.orderable_field)

    def get_fieldsets(self, request, obj=None):
        # This fixed a strange bug
        # can't see why as super doesn't appear to have side-effects
        # However this is harmless because we discard the return value
        super(SelectiveInlineMixin, self).get_fieldsets(request, obj)
        if self.declared_fieldsets:
            return self.declared_fieldsets
        form = self.get_formset(request, obj, fields=None).form
        fields = [f for f in list(form.base_fields) if f != self.orderable_field]
        fields += list(self.get_readonly_fields(request, obj))

        return [(None, {'fields': fields})]

    def get_formset(self, request, obj=None, **kwargs):
        if 'fields' not in kwargs and self.orderable_field:
            kwargs['fields'] = flatten_fieldsets(self.get_fieldsets(request, obj)) + [self.orderable_field]
        return super(SelectiveInlineMixin, self).get_formset(request, obj=obj, **kwargs)

    @property
    def media(self):
        media = super(SelectiveInlineMixin, self).media
        media.add_js(['admin/js/django.formset.js', 'admin/js/jquery-ui-1.9.2.custom.min.js'])
        media.add_css({'all': ['admin/css/selective_inlines.css', ]})
        return media


class SelectiveInline(SelectiveInlineMixin, InlineModelAdmin):
    pass
