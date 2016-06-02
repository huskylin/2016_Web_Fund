from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user    = models.ForeignKey(User)
    content = models.CharField(max_length=100)
    date    = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.content
