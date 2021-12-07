from pathlib import Path
import io
import os
import environ
import django_heroku
import dj_database_url
from decouple import config


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!


# SECURITY WARNING: don't run with debug turned on in production!
env = environ.Env(DEBUG=(bool,False))

env_file = os.path.join(BASE_DIR.parent, '.env')

if os.path.isfile(env_file):
    env.read_env(env_file)
    

elif os.getenv('TRAMPOLINE_CI',None):
    
    placeholder = (
        f"SECRET_KEY=a\n"
        f"DATABASE_URL=sqlite://{os.path.join(BASE_DIR, 'db.sqlite3')}"
    )
    env.read_env(io.StringIO(placeholder))
else:
    
    raise Exception(" No local .env file or GOOGLE_CLOUD_PROJECT detected. No secrets found")

DEBUG = True
ALLOWED_HOSTS = ['testserver', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'threeD.apps.ThreedConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'threeD.templatetags',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

ROOT_URLCONF = 'bckEnd.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.parent / 'threeD/Templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
LOGGING = {
    'version': 1,
    'disable_exisiting_loggers': False,
    'handlers':{
        'console':{
            'class': 'logging.StreamHandler'
        }
    },
    'root':{
        'handlers': ['console'],
        'level': 'INFO'
    }

}
LOGIN_REDIRECT_URL = '/profile/'

LOGIN_URL = '/'

WSGI_APPLICATION = 'bckEnd.wsgi.application'

ROOT_URI = 'http:/127.0.0.1:8000/'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'main',
        'USER': 'postgres',
        'PASSWORD': os.getenv('DATABASE_PASS'),
        'HOST': '127.0.0.1',
        'PORT': '5432',


    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"

AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILE_DIRS = (
    os.path.join(BASE_DIR, 'static'),

)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

