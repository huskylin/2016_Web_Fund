from django.shortcuts import (render_to_response,
    HttpResponse,
    HttpResponseRedirect,)

def slide(request):
    return render_to_response('slide.html', locals())