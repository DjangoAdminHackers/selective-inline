django-selective-inline
=======================

This is a small app for creating nice inlines in django admin::

![Alt text](https://raw.github.com/DjangoAdminHackers/selective-inline/master/example/example.png)


Installing
----------

You may install it via `pip` or clone all repository::

    pip install git+https://github.com/DjangoAdminHackers/selective-inline.git

Also you need to add `selinline` to your `INSTALLED_APPS` list


Usage
-----

The app provides one more inline class which supports all admin inline options and more.

So admin.py example file::

    from django.contrib import admin
    from selinline.admin import SelectiveInline
    from .models import Author, Book

    class BookAdminInline(SelectiveInline):
        orderable_field = 'order_num'  # this option is required only for "ordering" feature
        model = Book
        extra = 1

    class AuthorAdmin(admin.ModelAdmin):
        inlines = (BookAdminInline, )

    admin.site.register(Author, AuthorAdmin)

You may check out complete test project in the "example" project folder


Ordering records
----------------

`django-selective-inlines` supports ordering inline records via drag-n-drop. For that you need to have some integer
field in your model for storing order number value. So just set `orderable_field` property equals to that field name
inside your inline class like in example above and that's it.