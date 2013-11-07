#!/usr/bin/env python

from setuptools import setup

setup(name='django-selective-inline',
    version='0.0.1',
    description='Nice inlines for django admin',
    author='Millioner',
    author_email='millioner.bbb@gmail.com',
    url='https://github.com/DjangoAdminHackers/selective-inline',
    packages=['selinline', ],
    include_package_data = True,    # include everything in source control
    zip_safe=False,
    classifiers = [
        "Programming Language :: Python",
        "Programming Language :: Python :: 2",
        "Development Status :: 4 - Beta",
        'Environment :: Web Environment',
        "Intended Audience :: Developers",
        "License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)",
        "Operating System :: OS Independent",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Software Development :: User Interfaces",
        "Framework :: Django",
        ],
    long_description = """\
Nice inlines for django admin
"""
)
