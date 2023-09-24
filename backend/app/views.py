import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

# Create your views here.

def index(request):
    return JsonResponse({'message': 'Hello, world!'})

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        form = UserCreationForm(data)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return JsonResponse({"status": "success", "message": "Registration successful."})
        else:
            return JsonResponse({"status": "error", "errors": form.errors})
    return JsonResponse({"status": "invalid_method"})

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        form = AuthenticationForm(request, data=data)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"status": "success", "message": f"You are now logged in as {username}."})
            else:
                return JsonResponse({"status": "error", "message": "Invalid username or password."})
        else:
            return JsonResponse({"status": "error", "message": "Invalid username or password."})
    return JsonResponse({"status": "invalid_method"})

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"status": "success", "message": "Successfully logged out."})

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'status': "success", "message": "CSRF cookie set"})
