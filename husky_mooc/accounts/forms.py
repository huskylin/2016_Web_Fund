from django import forms


class SignupForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)
    email = forms.EmailField(max_length=50)
    nickname = forms.EmailField(max_length=50)
    age = forms.DecimalField(max_digits=100, decimal_places=0)
    description = forms.CharField(max_length=50, required=False)
    is_handsome = forms.BooleanField()


class SigninForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput)
