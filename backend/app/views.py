import json
import os
from dotenv import load_dotenv
import openai
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .forms import UserCreationForm,FlashcardForm
from .models import Deck, Flashcard, DeckFlashcard
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

# Initialize OpenAI API Key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def index(request):
    return JsonResponse({'message': 'Hello, world!'})

# Protected route example
class ProtectedView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return JsonResponse({'message': 'You are authenticated.'})

def username_exists(username):
    return User.objects.filter(username=username).exists()

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        form = UserCreationForm(data)
        if form.is_valid():
            user = form.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            login(request, user)
            return JsonResponse({"access_token": access_token, "status": "success", "message": "Registration successful."})
        else:
            return JsonResponse({"status": "error", "errors": form.errors})
    return JsonResponse({"status": "invalid_method"})

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return JsonResponse({"access_token": access_token, "status": "success", "message": f"You are now logged in as {user}."})
        else:
            if username_exists(data['username']):
                return JsonResponse({"status": "error", "errorType": "wrongPassword"})
            return JsonResponse({"status": "error", "errorType": "wrongUsername"})
    return JsonResponse({"status": "invalid_method"})

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"status": "success", "message": "Successfully logged out."})

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'status': "success", "message": "CSRF cookie set"})

# Creating Deck
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_deck(request):
    if request.method == 'POST':
        # Assume you are receiving a block of text and deck_id as POST data
        flashcard_content = request.POST.get('content', '')

        try:
            # Call OpenAI API to generate flashcards
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You will be provided with a block of text, and your task is to extract a list of terms and definitions from it as if you were generating flashcards in JSON format. Create a name for this deck of flashcards. Output example\n[\n  {\n    \"name\": \n  },\n  {\n    \"term\": \n    \"definition\":\n  },\n  {\n    \"term\": \n    \"definition\": \n  }\n]"
                    },
                    {
                        "role": "user",
                        "content": flashcard_content
                    }
                ],
                temperature=0.5,
                max_tokens=256,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            assistant_content = json.loads(response['choices'][0]['message']['content'])
            # Extract the generated deck name and flashcards
            deck_name = assistant_content[0]['name']
            flashcards_data = assistant_content[1:]
            # Create a new deck for this block of text
            deck = Deck.objects.create(deck_name=deck_name, user=request.user)
            # Create each generated flashcard and link it to the deck
            for item in flashcards_data:
                term = item['term']
                definition = item['definition']
                flashcard = Flashcard.objects.create(term=term, definition=definition, user=request.user)
                DeckFlashcard.objects.create(deck=deck, flashcard=flashcard)

            return JsonResponse({"status": "success", "message": "Flashcards and Deck created successfully."})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Could not decode flashcards data from the API."})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

    return JsonResponse({"status": "invalid_method"})

# Deleting Deck
@csrf_exempt
def delete_deck(request, deck_id):
    deck = get_object_or_404(Deck, pk=deck_id)
    if request.user == deck.user:
        deck.delete()
        return JsonResponse({"status": "success", "message": "Deck deleted successfully."})
    else:
        return JsonResponse({"status": "error", "message": "You do not have permission to delete this deck."})

# Creating Flash Card
@csrf_exempt
def create_flashcard(request):
    if request.method == 'POST':
        form = FlashcardForm(request.POST)
        if form.is_valid():
            flashcard = form.save(commit=False)
            flashcard.user = request.user  # Authenticated User
            deck_id = request.POST.get('deck_id')  # Get the deck associated with the flashcard
            
            try:
                deck = Deck.objects.get(pk=deck_id, user=request.user)  # Make sure the deck belongs to the user
            except Deck.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Deck not found or you don't have permission to add to this deck."})
            
            flashcard.save()
            DeckFlashcard.objects.create(deck=deck, flashcard=flashcard)
            
            return JsonResponse({"status": "success", "message": "Flashcard added to the deck successfully."})
        else:
            return JsonResponse({"status": "error", "message": form.errors})

    return JsonResponse({"status": "invalid_method"})

# Deleting Flash Card
@csrf_exempt
def delete_flashcard(request, flashcard_id):
    flashcard = get_object_or_404(Flashcard, pk=flashcard_id)
    if request.user == flashcard.user:
        flashcard.delete()
        return JsonResponse({"status": "success", "message": "Flashcard deleted successfully."})
    else:
        return JsonResponse({"status": "error", "message": "You do not have permission to delete this flashcard."})
    

# Editing Flash Card
@csrf_exempt
def edit_flashcard(request, flashcard_id):
    if request.method == 'POST':
        try:
            flashcard = Flashcard.objects.get(pk=flashcard_id, user=request.user)  # Assuming 'user' is the user field in your Flashcard model
        except Flashcard.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Flashcard not found or you don't have permission to edit it."})
        
        form = FlashcardForm(request.POST, instance=flashcard)  # Populate the form with the flashcard data
        if form.is_valid():
            updated_flashcard = form.save()
            return JsonResponse({"status": "success", "message": "Flashcard updated successfully."})
        else:
            return JsonResponse({"status": "error", "message": form.errors})

    return JsonResponse({"status": "invalid_method"})
