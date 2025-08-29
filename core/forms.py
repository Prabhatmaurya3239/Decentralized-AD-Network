from django import forms

class CustomLoginForm(forms.Form):
    username_or_email = forms.CharField(
        label="Username or Email", max_length=150, widget=forms.TextInput(attrs={"class": "form-control"})
    )
    wallet_address = forms.CharField(
        label="Wallet Address", max_length=255, widget=forms.TextInput(attrs={"class": "form-control", "readonly": "readonly"})
    )
    password = forms.CharField(
        label="Password", widget=forms.PasswordInput(attrs={"class": "form-control"})
    )
