from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.template import RequestContext
from django.shortcuts import (
    render_to_response,
    HttpResponse,
    HttpResponseRedirect,
)

def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        email    = request.POST.get('email', '')

        if User.objects.filter(username=username).exists():
            return HttpResponse('User exists!!')

        if User.objects.filter(email=email).exists():
            return HttpResponse('Email has been registered!')

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        new_user.save()
        return HttpResponseRedirect('/index')

    return render_to_response('signup.html', locals(), RequestContext(request))

def signin(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/index')

    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    user = auth.authenticate(username=username, password=password)

    if user is not None and user.is_active:
        auth.login(request, user)
        return HttpResponseRedirect('/index')

    return render_to_response('signin.html', locals(), RequestContext(request))

def signout(request):
    auth.logout(request)
    return HttpResponseRedirect('/index')

@login_required(login_url='/accounts/signup')
def profile(request):
    return render_to_response('profile.html', locals())

"""
See this page
http://dokelung-blog.logdown.com/posts/234437-django-notes-10-users-login-and-logout
http://dokelung-blog.logdown.com/posts/234896-django-notes-11-permission-and-registration
"""
