from django.shortcuts import render_to_response

def index(request):
    husky = { 'name': '林昱辰', 'age': 20, 'horoscope': 'Scorpio' }
    return render_to_response('index.html', locals())
