from django.contrib import admin
from accounts.models import User, Post


class UserAdmin(admin.ModelAdmin):
    list_display  = ('username','grade','department','rank','date')
    """list_filter   = ('is_handsome',)"""
    search_fields = ('username',)
    fields        = ('username', 'nickname', '')
    ordering      = ('date',)


class PostAdmin(admin.ModelAdmin):
    list_display  = ('user', 'content', 'date')
    search_fields = ('user__username',)
    fields        = ('user', 'content')
    ordering      = ('date',)


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
