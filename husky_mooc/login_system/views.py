from django.shortcuts import render_to_response
from login_system.models import User, Post

def signup(requests):
    users = User.objects.all()
    posts = User.objects.all()
    return render_to_response('signup.html', locals())
