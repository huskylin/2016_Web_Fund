from django.db import models

# Create your models here.
class Member(models.Model):
    username = models.CharField(max_length=40)
    age  = models.DecimalField(max_digits=100, decimal_places=0)
    desciption = models.CharField(max_length=100, blank=True)
    is_handsome = models.BooleanField()
