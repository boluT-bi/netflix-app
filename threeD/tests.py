from django.test import RequestFactory,TestCase,Client
from django.contrib.auth.models import User,Profile
from django.http import request
from threeD.views import profile, logIn
from django.contrib.auth import authenticate


class AuthTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user('test@dom.com', 'test@dom.com', 'pass')
        self.u.is_staff = True
        self.u.is_active = True
        self.u.is_superuser = True
        self.u.save()
    def testLogin(self):
        self.client.login(username='test@dom.com', password='pass')





class AuthenticationTest(TestCase):
    def setUp(self):
        self.factory= RequestFactory()
        self.c = Client()
        self.user = User.objects.create_user(username='jacob', email='jacob@…', password='top_secret')

    
    def test_details(self):

        request = self.factory.get('/profile/')

        request.user = self.user
        response = profile(request)

        self.assertEqual(response.de, 200)
        

        
    


# Create your tests here.
