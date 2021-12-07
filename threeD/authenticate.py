from logging import exception
from django.contrib.auth.models import User
from django.core.checks.messages import Error
from django.contrib.auth.hashers import check_password
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user
from .models import Profile

class CustomAuth(BaseBackend):


    def authenticate(username = None, password = None ):

        try:
            login_valid = User.objects.get(username = username)
            pass_valid = check_password(password, login_valid.password)
            if login_valid and pass_valid:
                
                return login_valid
            else:
                return 'password does not match username saved with us'
        except Exception:
            return None
    def get_user(user_id):
        try:
            return User.objects.get(pk = user_id)
        except User.DoesNotExist:
            return None



    def prof_auth(username = None,profile_name = None):
        auth_user = User.objects.get(username = username)
        profs = Profile.objects.filter(user = auth_user)
        
        for prof in profs:
            if str(prof) == profile_name:
                return 0
        return 1


            
    