### -*- coding: utf-8 -*- ###

from django.contrib import admin

from selinline.admin import SelectiveInline

from .models import Author, Book


class BookAdminInline(SelectiveInline):
    orderable_field = 'order_num'
    model = Book
    extra = 1


class AuthorAdmin(admin.ModelAdmin):
    inlines = (BookAdminInline, )


admin.site.register(Author, AuthorAdmin)