from .common import *
import os

DEBUG = False
ALLOWED_HOSTS = ['*',]
ROOT_URI = 'https://ntflx-app.heroku.com/'


db_from_env = dj_database_url.config(conn_max_age = 600)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())
