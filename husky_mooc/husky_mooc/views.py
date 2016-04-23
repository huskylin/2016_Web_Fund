from django.shortcuts import render_to_response

def index(request):
    husky   = { 'name': '林昱辰', 'age': 20, 'horoscope': 'Scorpio',
            'is_handsome': False }
    yoga    = { 'name': '潘昱嘉', 'age': 20, 'horoscope': 'Aries',
            'is_handsome': True }
    shuohan = { 'name': '高碩亨', 'age': 99, 'horoscope': 'Unknown',
            'is_handsome': True }
    people  = [husky, yoga, shuohan]
    return render_to_response('index.html', locals())
