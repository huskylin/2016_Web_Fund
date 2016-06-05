from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user    = models.ForeignKey(User)
    content = models.CharField(max_length=300)
    date    = models.DateField(auto_now_add=True)

    def as_json(self):
        return dict(
            id=self.id, content=self.content,
            user=self.user.username,
            date=self.date.isoformat(),
           	)

    def __str__(self):
        return self.content
