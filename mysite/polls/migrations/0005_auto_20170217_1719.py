# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-17 22:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0004_auto_20170217_1716'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='standardevent',
            name='address',
        ),
        migrations.RemoveField(
            model_name='standardevent',
            name='location',
        ),
    ]
