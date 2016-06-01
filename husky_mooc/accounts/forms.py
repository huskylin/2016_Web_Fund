from django import forms


class SignupForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)
    email = forms.EmailField(max_length=50)
    nickname = forms.EmailField(max_length=50)
    department  = models.CharField(max_length=50)
    grade       = models.DecimalField(max_digits=4, decimal_places=0)
    description = forms.CharField(max_length=50, required=False)


class SigninForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)
