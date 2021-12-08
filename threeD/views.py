from django.shortcuts import render
from django.http import request,HttpResponseRedirect,HttpResponse
from django.urls import reverse
from django.views import View
from threeD.forms import UserForm, ClientForm,ProfileForm
from django.core import validators
from threeD.models import Clients,Profile
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.utils.http import is_safe_url
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.views.generic.edit import CreateView
from threeD.authenticate import CustomAuth
import logging



log = logging.getLogger(__name__)

def search(request):
    activeProfile = request.session.get('active_profile')
    if activeProfile:
        query = request.GET.get('q',None)
        user_name = request.user
        profiles = Profile.objects.filter(user = user_name)
        context = {'activeProfile': activeProfile,
                    'profiles': profiles,
                    'query': query
                }
        return render(request, '3D/search.html', context)
    else:
        if request.session.get('user', None):

            return HttpResponseRedirect(reverse('profile'))
        else:
            return HttpResponseRedirect(reverse('login'))
    return 0


def profileSwitch(request):
    profile = request.GET.get('prof', None)
    if profile:
        request.session["active_profile"] = request.GET.get('prof', '')
        return HttpResponseRedirect(reverse('main'))

def my_list(request):
    activeProfile = request.session.get('active_profile', None)
    if activeProfile:
        user_name = request.user
        profiles = Profile.objects.filter(user = user_name)
        context = {'activeProfile': activeProfile,
                    'profiles': profiles}
        return render(request, '3D/my-list.html', context)
    else:
        if request.session.get('user', None):

            return HttpResponseRedirect(reverse('profile'))
        else:
            return HttpResponseRedirect(reverse('login'))
    return 0

def genre_view(request, genre_id):
    activeProfile = request.session.get('active_profile', None)
    searchType = request.GET.get('bc', None)
    if activeProfile:
        user_name = request.user
        profiles = Profile.objects.filter(user = user_name)
        context = {'activeProfile': activeProfile,
                    'profiles': profiles,
                    'genreId': genre_id,
                    'searchType': searchType}
        return render(request, '3D/genre_display.html', context)
    else:
        if request.session.get('user', None):

            return HttpResponseRedirect(reverse('profile'))
        else:
            return HttpResponseRedirect(reverse('login'))
    return 0
def latest(request):
    activeProfile = request.session.get('active_profile', None)
    if activeProfile:
        user_name = request.user
        profiles = Profile.objects.filter(user = user_name)
        context = {'activeProfile': activeProfile,
                    'profiles': profiles}
        return render(request, '3D/latest.html', context)
    else:
        if request.session.get('user', None):

            return HttpResponseRedirect(reverse('profile'))
        else:
            return HttpResponseRedirect(reverse('login'))
    return 0

def cat_view(request,category):
    
    activeProfile = request.session.get('active_profile',None)
    
    
    search_type = request.GET.get('bc', None)
    if activeProfile:
        user_name = Profile.objects.get(name = activeProfile).user
        profiles = Profile.objects.filter(user = user_name)
        context = {'activeProfile': activeProfile,
                    'profiles': profiles,
                    'searchType': search_type,
                    'category': category}
        return render(request, '3D/popular-titles.html', context)
    else:
        if request.session.get('user', None):

            return HttpResponseRedirect(reverse('profile'))
        else:
            return HttpResponseRedirect(reverse('login'))
    return 0
   
    

def movies(request):
    user = request.session.get('user', None)

    activeProfile = request.session.get('active_profile', None)
    if activeProfile:
        
        profiles = Profile.objects.filter(user = User.objects.get(username = user))
    else:
        return redirect('profiles/')
    if not request.user.is_authenticated:
        return redirect('%s?next=%s'%(settings.LOGIN_URL,request.path))
    
    return render(request, '3D/movies.html', {'profiles': profiles, 'activeProfile': activeProfile})

def tv_shows(request):
    user = request.session.get('user', None)
    
    activeProfile = request.session.get('active_profile', None)
    if activeProfile:
        profiles = Profile.objects.filter(user = User.objects.get(username = user))
    else:
        return redirect('profiles/')
    if not request.user.is_authenticated:
        return redirect('%s?next=%s'% (settings.LOGIN_URL,request.path))
   
    
    return render(request, '3D/tvShows.html',{'activeProfile': activeProfile, 'profiles':profiles})

def mainTab(request):

    if request.META.get('HTTP_REFFERER') == settings.ROOT_URI +'tab/':
        return HttpResponseRedirect(settings.REDIRECT_URI)


    return render(request, '3D/mainTab.html')


def drawingBoard(request):
    return render(request, '3D/drawingBoard.html')


def main(request):
    username = request.session.get('user', None)
    
    activeProfile = request.session.get('active_profile', None)
    
    if activeProfile:

        request.session["profile_active"] = activeProfile
        profiles = Profile.objects.filter(user = User.objects.get(username = username))
    else:
        return redirect('profiles/')
    if not request.user.is_authenticated:
        return redirect('%s?next=%s'%(settings.LOGIN_URL,request.path))
    
    return render(request, '3D/main.html', {'username': username, 'profiles': profiles, 'activeProfile': activeProfile})




class AccountCreation(View):
    forms = UserForm
    
    def get(self,request):
        form = self.forms
        return render(request, '3D/AccountSelection.html', {'form': form})
    
    def post(self,request):
        form = self.forms(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('http://127.0.1:8000/logIn')
        else:
            form = UserForm
            invalidText = 'Username or password invalid'
        return render(request, '3D/AccountSelection.html', {'InvalidText':invalidText, 'form':form})

def logOut(request):
    request.session.flush()
    logout(request)
    if not request.user.is_authenticated:
        return login_view(request)
    return render(request, '3D/logout.html')


def logIn(request):
    form = ClientForm

    if request.method == 'POST':
        
        
        form = ClientForm(request.POST)
        
        
        if form.is_valid():
            user_input = form.cleaned_data['username']
        
            pass_input = form.cleaned_data['password']
            p_user = authenticate(username = user_input, password = pass_input)
        
            user = CustomAuth.authenticate(username = user_input, password = pass_input)
            
            
            if user:
                
                if type(user) != str:
                
                    data = User.objects.get(username=user_input)
                    
                   
                    

                    messages.success(request, 'logged in!')
                    login(request,user)
                    request.session['user'] = data.username
                    
                    return login_view(request)
                else:
                    inval  = user
                    form = ClientForm
                    return render(request, '3D/index.html', {'form': form, 'inval': inval})
            

            else:
                new_user = User(username = user_input,first_name = 'john')
                new_user.set_password(pass_input)
                new_user.is_active = True
                new_user.save()
                new_profile = Profile(name = new_user.first_name, user = new_user)
                
                new_profile.save()
                
                
                
                login(request,new_user)
                request.session['user'] = user_input
                
                return login_view(request)
        else:
            inval = 'form is not valid'
            form = ClientForm
            return render(request, '3D/index.html', {'form': form, 'inval':inval})
        
    return render(request, '3D/index.html', {'form': form})

        
    


    
   
        
        
def login_view(request):
    nxt = request.GET.get("next",None)
    if nxt is None:
       
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
    elif not is_safe_url(url=nxt,allowed_hosts={request.get_host()},require_https=request.is_secure()):
        
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
    else:
        return HttpResponseRedirect(nxt)

   
    

def profile(request):
    
    username = request.session.get('user', None)
    

    if not request.user.is_authenticated:
        
        return HttpResponseRedirect('%s?next=%s' % (settings.LOGIN_URL,request.path))
    

            
    profiles = Profile.objects.filter(user = User.objects.get(username= username))
    
 
    
    
    context = {'username':username,
               'profiles': profiles}

       

    return render(request, '3D/AccountSelection.html', context)


def profCreate(request):
    username = request.session.get('user', '')
    form = ProfileForm
    if not request.user.is_authenticated:
        return HttpResponseRedirect('%s?next=%s' % (settings.LOGIN_URL,request.path))
    if request.method == 'POST':
        form = ProfileForm(request.POST)
        if form.is_valid():
            prof_valid = CustomAuth.prof_auth(username,form.cleaned_data['name'])
            if prof_valid:
                auth_user =  User.objects.get(username = username)
                val_user = Profile.objects.filter(user = auth_user)
                val_user.create(user_id = auth_user.id, name = form.cleaned_data['name'])

                return redirect('/profile/')
            else:
                inval_message = 'profile with this name already exists!'
                form = ProfileForm

                return render(request, '3D/prof-create.html', {'form': form, 'inval': inval_message})
    
    return render(request,  '3D/prof-create.html', {'form': form} )






