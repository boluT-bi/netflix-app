"""bckEnd URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path,include
from threeD import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.logIn, name = 'login'),
    re_path('SwitchProfile/', views.profileSwitch, name = 'switchProfile'),
    path('browse/', views.main, name= 'main'),
    path('createAccount/', views.AccountCreation.as_view(), name = 'createaccount'),
    path('tab/', views.mainTab),
    path('browse/genre/movie/', views.movies, name = 'movies'),
    path('browse/genre/tv/', views.tv_shows, name = 'tvShows'),
    path('browse/genre/<int:genre_id>/', views.genre_view, name= 'genre'),
    path('browse/<str:category>/', views.cat_view, name = 'category-url'),
    path('latest/', views.latest, name = 'latest'),
    path('my-list/', views.my_list, name='my-list'),
    path('profile/', views.profile, name = 'profile'),
    path('search/', views.search, name = 'search'),
    path('logout/', views.logOut, name = 'log-out'),
    
    path('profile/create-prof/', views.profCreate, name = 'prof-create')
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
