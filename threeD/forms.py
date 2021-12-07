from django import forms
from django.contrib.auth.models import User
from django.core import validators
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
from threeD.models import Clients,Profile


class MailField(forms.Field):  
    
    
    def validate(self,value):

        super().validate(value)
        regex = re.compile(r'\w+@\w+\.\w+')
        match = regex.match(value)
        if match==None:
            raise ValidationError(_('%(value)s is not valid'),params={'value':value},)
            


class PassField(forms.Field):

    def validate(self,value):
        super().validate(value)
        
        validation  = validators.RegexValidator(regex=r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[#@?$%^!-_&])[a-zA-Z\d#@?$%^!-_&]{8,}$', message='password must be alphanumerical with at least 1 special character and 8 or more characters long',
        flags=0)
        return validation


class UserForm(forms.ModelForm):
    class Meta:
        model = Clients
        fields = [ 'username','password']


class ClientForm(forms.Form):
    username = forms.CharField(max_length= 150)
    password = forms.CharField(widget = forms.PasswordInput())
    
       
class ProfileForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Name','max_length':'100','value':''}))