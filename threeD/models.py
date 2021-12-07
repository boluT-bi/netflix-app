from django.db import models
from django.core import validators
from django.contrib.auth.models import User


class Clients(models.Model):
    username = models.EmailField(validators = [validators.EmailValidator()])
    objects = models.Manager()
    password = models.CharField(max_length = 200, validators = [validators.RegexValidator(regex= r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#*&?!£$^@~|])[a-zA-Z\d#*&?!£$^@~|]{8,}$',flags=0, message='password must be at least 8 characters long with 1one or more numbers, uppercase letters, and special characters')])
    def __str__(self):
        return str(self.username)

class Profile(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    objects = models.Manager()

    def __str__(self):
        return str(self.name)

# Create your models here.
