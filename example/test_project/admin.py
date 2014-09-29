### -*- coding: utf-8 -*- ###

from django.contrib import admin
from django.contrib.admin.options import InlineModelAdmin

from selinline.admin import SelectiveInlineMixin

from .models import Author, Book


class BookAdminInline(SelectiveInlineMixin, InlineModelAdmin):
    orderable_field = 'order_num'
    model = Book
    extra = 0


class AuthorAdmin(admin.ModelAdmin):
    inlines = (BookAdminInline, )


admin.site.register(Author, AuthorAdmin)