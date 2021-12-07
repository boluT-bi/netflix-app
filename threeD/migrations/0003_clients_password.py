# Generated by Django 3.1.3 on 2020-12-17 15:12

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('threeD', '0002_auto_20201217_1505'),
    ]

    operations = [
        migrations.AddField(
            model_name='clients',
            name='password',
            field=models.CharField(default='defaultVal', max_length=200, validators=[django.core.validators.RegexValidator(flags=0, regex='^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#*&?!£$^@~|])[a-zA-Z\\d#*&?!£$^@~|]{8,}$')]),
            preserve_default=False,
        ),
    ]
