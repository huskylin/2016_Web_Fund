from django.contrib import admin
from login_system.models import User, Post


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'age', 'is_handsome', 'date')
    list_filter  = ('is_handsome',)
    search_fields = ('username',)
    ordering = ()

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'date')
    ordering = ('-date')

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
