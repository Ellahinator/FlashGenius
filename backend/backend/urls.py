"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="home"),
    path('protected/', views.ProtectedView.as_view(), name='protected'),
    path("signup/", views.signup_view, name="signup_view"),
    path("login/", views.login_view, name="login_view"),
    path("logout/", views.logout_view, name="logout_view"),
    path("csrf_cookie", views.get_csrf_token, name="csrf"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # URL pattern for creating a deck
    path('deck/create/', views.create_deck, name='create_deck'),
    # URL pattern for creating a flashcard
    path('flashcard/create/', views.create_flashcard, name='create_flashcard'),
    # URL pattern for deleting a Flashcard
    path('flashcards/<int:flashcard_id>/delete/', views.delete_flashcard, name='delete_flashcard'),
    # URL pattern for deleting a Deck
    path('deck/<int:deck_id>/delete/', views.delete_deck, name='delete_deck'),
]
