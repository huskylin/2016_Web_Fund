from django.db import models


class User(models.Model):
    username    = models.CharField(max_length=50)
    password    = models.CharField(max_length=50)
    nickname    = models.CharField(max_length=50)
    age         = models.DecimalField(max_digits=100, decimal_places=0)
    desciption  = models.CharField(max_length=100, blank=True)
    is_handsome = models.BooleanField()
    date        = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.username


class Post(models.Model):
    user    = models.ForeignKey(User)
    content = models.CharField(max_length=100)
    date    = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.content
