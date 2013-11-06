### -*- coding: utf-8 -*- ###

from django.db import models


class Author(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    birth_date = models.DateField()


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, related_name='books')
    isbn = models.CharField(max_length=25)
    price = models.DecimalField(decimal_places=2, max_digits=12)
    in_stock = models.NullBooleanField()
    order_num = models.PositiveSmallIntegerField(default=0)

    def __unicode__(self):
        return self.title