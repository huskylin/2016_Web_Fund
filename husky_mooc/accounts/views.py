from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.template import RequestContext
from django.shortcuts import (
    render_to_response,
    HttpResponse,
    HttpResponseRedirect,
)
from django.http import JsonResponse
import json
from .models import Post

def slide(request):
    return render_to_response('slide.html', locals())

def index(request):
    return render_to_response('index.html', locals())

def signup(request):
    if request.method == 'POST':
        ajax_data = json.loads(str(request.body.decode("utf-8")))
        username  = ajax_data['username']
        password  = ajax_data['password']
        email     = ajax_data['email']

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'errorMessage': 'User exists!'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'errorMessage': 'Email has been registered!'})
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        new_user.save()
        return JsonResponse({'success': True, 'redirect': '/index'})

    return render_to_response('signup.html', locals(), RequestContext(request))

def signin(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/index')
    
    if request.method == 'POST':  
        ajax_data = json.loads(str(request.body.decode("utf-8")))
        username  = ajax_data['username']
        password  = ajax_data['password']
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            return JsonResponse({'success': True, 'redirect': '/index'})
        else:
            return JsonResponse({'success': False, 'errorMessage': 'login fail!'})

    return render_to_response('signin.html', locals(), RequestContext(request))

def signout(request):
    auth.logout(request)
    return HttpResponseRedirect('/index')

def load(request):
    ajax_data = json.loads(str(request.body.decode("utf-8")))
    minId     = int(ajax_data['minId'])
    howMany   = int(ajax_data['howMany'])


    if request.method == 'POST':
        ajax_data = json.loads(str(request.body.decode("utf-8")))
        posts = Post.objects.filter(id__lt = minId)

        jsonpost = []
        for post in posts:
            jsonpost.append(post.as_json())
        if len(jsonpost) == 0:
            return JsonResponse({'success': False, 'errorMessage': 'No content'})
        else:
            return JsonResponse({'success': True, 'posts': jsonpost[-howMany:]})


@login_required(login_url='/accounts/signin')
def profile(request):
    return render_to_response('profile.html', locals())

@login_required(login_url='/accounts/signin')
def post(request):
    if request.method == 'POST':
        ajax_data    = json.loads(str(request.body.decode("utf-8")))
        user    = request.user
        content = ajax_data['content']
        maxId = ajax_data['maxId']
        print(maxId)

        new_post = Post(content=content, user=user)
        new_post.save()
        
        posts = Post.objects.filter(id__gt = maxId)
        jsonpost = []
        for post in posts:
            jsonpost.append(post.as_json())
        if len(jsonpost) == 0:
            return JsonResponse({'success': False, 'errorMessage': 'No content'})
        else:
            return JsonResponse({'success': True, 'posts': jsonpost})

    return render_to_response('post.html', locals(), RequestContext(request))
"""
See this page
http://dokelung-blog.logdown.com/posts/234437-django-notes-10-users-login-and-logout
http://dokelung-blog.logdown.com/postsa/234896-django-notes-11-permission-and-registration
"""