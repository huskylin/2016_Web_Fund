"""husky_mooc URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from accounts.views import signup, signin, signout, profile, slide, index, post

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', index),
    url(r'^index/$', index),
    url(r'^accounts/signup/$', signup),
    url(r'^accounts/signin/$', signin),
    url(r'^accounts/signout/$', signout),
    url(r'^accounts/profile/$', profile),
    url(r'^post/$', post),
    url(r'^learn/slide/$', slide),
]