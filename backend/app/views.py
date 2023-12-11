import json
import os
import datetime
import uuid
from dotenv import load_dotenv
import openai
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .forms import UserCreationForm, FlashcardForm
from .models import Deck, Flashcard, DeckFlashcard
from .serializers import DeckSerializer, DeckFlashcardSerializer
from django.contrib.auth import login, logout, authenticate,update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
# Create your views here.

# Initialize OpenAI API Key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

class IndexView(APIView):
    def get(self, request):
        return Response({'message': 'Hello, world!'})

# Protected route example
class ProtectedView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'message': 'You are authenticated.'})

class AuthView(APIView):
    @csrf_exempt
    def post(self, request, action):
        # Parse the request body to get the data
        data = parse_request_body(request)
        # Check if the data is valid JSON
        if data is None:
            return Response({"status": "error", "message": "Invalid JSON."}, status=status.HTTP_400_BAD_REQUEST)
        # Check the action type and call the appropriate method   
        if action == 'signup':
            return self.signup(request, data)
        elif action == 'login':
            return self.login(request, data)
        elif action == 'logout':
            return self.logout(request)
        elif action == 'change_password':
            return self.change_password(request,data)
        #Return an error response for an invalid action
        return Response({"status": "error", "message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    def signup(self, request, data):
        # Create a UserCreationForm instance with the provided data
        form = UserCreationForm(data)
        # Check if the form is valid
        if form.is_valid():
            # Save the user created by the form
            user = form.save()
            # Create a JWT access token and refresh token for the new user 
            access_token, refresh_token = create_jwt_with_user_info(user)
            # Log in the user after successful registration 
            login(request, user)
            # Return a success response with the access token and a welcome message
            return Response({
                "status": "success",
                "access_token": access_token,
                "refresh_token": refresh_token, 
                "message": "Registration successful."
            }, status=status.HTTP_201_CREATED)
        else:
            # Return an error response with form validation errors
            return Response({"status": "error", "errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)

    def login(self, request, data):
        # Get username and password from the request data
        username = data.get('username')
        password = data.get('password')

        # Authenticate the user using the provided username and password
        user = authenticate(username=username, password=password)

        # Check if authentication is successful
        if user is not None:
             # If successful, create a JWT access token and refresh token for the user
            access_token, refresh_token = create_jwt_with_user_info(user)
            # Return a success response with the access token and a welcome message
            return Response({
                "status": "success",
                "access_token": access_token,
                "refresh_token": refresh_token, 
                "message": f"You are now logged in as {user}."
            }, status=status.HTTP_200_OK)
        else:
            # If authentication fails, check whether the username or password is incorrect
            if username_exists(username):
                # Return an error response for incorrect password
                return Response({"status": "error", "message": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)
            # Return an error response for incorrect username
            return Response({"status": "error", "message": "Incorrect username."}, status=status.HTTP_400_BAD_REQUEST)

    def logout(self, request):
        logout(request)
        return Response({"status": "success", "message": "Successfully logged out."}, status=status.HTTP_200_OK)

    def change_password(self,request,data):
        
        user = request.user
        form = PasswordChangeForm(user,data)
        if form.is_valid():
            user = form.save()
            # Update the session to prevent the user from being logged out after changing the password
            update_session_auth_hash(request,user)
            return Response({"status":"success","message":"Password changed successfully"},status=status.HTTP_200_OK)
        else:
            return Response({"status":"error","errors":form.errors},status=status.HTTP_400_BAD_REQUEST) 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    # Retrieve the authenticated user from the request
    user = request.user
    # Return a response with the user information
    return Response({
        'user_id': user.id,
        'username': user.username,
        'email': user.email
    })

@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'status': "success", "message": "CSRF cookie set"})

class DeckView(APIView):
    # Set authentication classes for the view
    authentication_classes = (JWTAuthentication,)

    # Set permission classes for the view
    permission_classes = (IsAuthenticated,)

    @csrf_exempt
    def post(self, request, action):
        # Check the action type and call the appropriate method
        if action == 'create':
            return self.create_deck(request)
        elif action == 'delete':
            # Get deck_id from the request data
            deck_id = request.data.get('deck_id')
            return self.delete_deck(request, deck_id)
        elif action == 'update':
            # Get deck_id and deck_name from the request data
            deck_id = request.data.get('deck_id')
            deck_name = request.data.get('deck_name')
            return self.update_deck(request, deck_id, deck_name)
        elif action == 'get':
            # Get deck_id from the request data
            deck_id = request.data.get('deck_id')
            return self.get_deck(request, deck_id)
        else:
            # Return an error response for an invalid action
            return Response({"message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # Retrieve decks belonging to the authenticated user
            user_decks = Deck.objects.filter(user=request.user)
            # Serialize the user's decks
            serializer = DeckSerializer(user_decks, many=True)

            # Return a success response with the serialized decks
            return Response({
                "status": "success",
                "decks": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Return an error response if an exception occurs during the process
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                                
    def create_deck(self, request):
        # Assume you are receiving a block of text and deck_id as POST data
        flashcard_content = request.data.get('content', '')
        # Retrieve the deck_name or generate a unique one if not provided
        deck_name = request.data.get('deck_name', f"Deck-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:8]}")

        try:
            print("Calling OpenAI API...")
            # Call OpenAI API to generate flashcards
            response = openai.ChatCompletion.create(
                model="ft:gpt-3.5-turbo-0613:personal::8HjCOVU3",
                messages=[
                    {
                        "role": "system",
                        "content": "Given a block of text, extract key terms and their explanations, and format them into a set of flashcards in JSON format. Each flashcard contains a term and its corresponding definition."},
                    {
                        "role": "user",
                        "content": flashcard_content
                    }
                ]
            )
            # Parse the JSON string from the response
            assistant_content = json.loads(response['choices'][0]['message']['content'])
            flashcards_data = assistant_content['flashcards']
            # Create a new deck for this block of text
            deck = Deck.objects.create(user=request.user, deck_name=deck_name)
            # Create each generated flashcard and link it to the deck
            for item in flashcards_data:
                term = item['term']
                definition = item['definition']
                flashcard = Flashcard.objects.create(term=term, definition=definition, user=request.user)
                DeckFlashcard.objects.create(deck=deck, flashcard=flashcard)

            return Response({"status": "success", "deck_id": deck.deck_id,"message": "Flashcards and Deck created successfully." }, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return Response({"status": "error", "message": "Could not decode flashcards data from the API."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def delete_deck(self, request, deck_id):
        # Retrieve the Deck object with the specified deck_id or return a 404 error
        deck = get_object_or_404(Deck, pk=deck_id)

        # Check if the authenticated user is the owner of the deck
        if request.user == deck.user:
            # If the user is the owner, delete the deck
            deck.delete()
            return Response({"status": "success", "message": "Deck deleted successfully."}, status=status.HTTP_200_OK)
        else:
            # If the user is not the owner, return an error response
            return Response({"status": "error", "message": "You do not have permission to delete this deck."}, status=status.HTTP_403_FORBIDDEN)
    
    def update_deck(self, request, deck_id, deck_name):
        try:
            # Retrieve the Deck object with the specified deck_id or return a 404 error
            deck = get_object_or_404(Deck, pk=deck_id)

            # Check if the authenticated user is the owner of the deck
            if request.user == deck.user:
                # Update the deck name
                deck.deck_name = deck_name
                deck.save()
                return Response({"status": "success", "message": "Deck name updated successfully."}, status=status.HTTP_200_OK)
            else:
                # Return an error response if the user is not the owner of the deck
                return Response({"status": "error", "message": "You do not have permission to update this deck."}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            # Return an error response if an exception occurs during the process
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @csrf_exempt
    def get_deck(self, request, deck_id):
        try:
            # Retrieve the Deck object with the specified deck_id or return a 404 error
            deck = get_object_or_404(Deck, deck_id=deck_id)
            # Check if the authenticated user has permission to view this deck        
            if request.user != deck.user:
                return Response({"status": "error", "message": "You do not have permission to view this deck."}, status=status.HTTP_403_FORBIDDEN)
            
            # Retrieve all flashcards associated with the deck and order them by position
            deck_flashcards = DeckFlashcard.objects.filter(deck=deck).order_by('position')
            
            # Serialize the deck and the associated flashcards
            serialized_deck = DeckSerializer(deck).data
            serialized_flashcards = DeckFlashcardSerializer(deck_flashcards, many=True).data
            

            # Return a success response with the serialized deck and flashcards
            return Response({
                "status": "success",
                "deck": serialized_deck,
                "flashcards": [fc['flashcard'] for fc in serialized_flashcards]
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Return an error response if an exception occurs during the process
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FlashcardView(APIView):
    # Set authentication classes for the view
    authentication_classes = (JWTAuthentication,)
    
    # Set permission classes for the view
    permission_classes = (IsAuthenticated,)

    @csrf_exempt
    def post(self, request, action):
        # Check the action type and call the appropriate method
        if action == 'create':
            return self.create_flashcard(request)
        elif action == 'delete':
            # Get flashcard_id from the request data
            flashcard_id = request.data.get('flashcard_id')
            if flashcard_id:
                return self.delete_flashcard(request, flashcard_id)
        
        # Return an error response for an invalid action
        return Response({"status": "error", "message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    def create_flashcard(self, request):
        
        # Create a FlashcardForm instance with the POST data from the request
        form = FlashcardForm(request.POST)
        # Check if the form is valid
        if form.is_valid():
           
            # Create a Flashcard object from the form data, but don't save it to the database yet
            flashcard = form.save(commit=False)
           
            # Set the user field of the flashcard to the authenticated user
            flashcard.user = request.user

            # Get the deck_id associated with the flashcard from the POST data
            deck_id = request.POST.get('deck_id')

            try:
                # Make sure the deck belongs to the user
                deck = Deck.objects.get(pk=deck_id, user=request.user) 
            except Deck.DoesNotExist:
                # Return an error response if the deck is not found or the user doesn't have permission
                return Response({"status": "error", "message": "Deck not found or you don't have permission to add to this deck."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the flashcard to the database
            flashcard.save()
            
            # Create a DeckFlashcard association between the deck and the flashcard
            DeckFlashcard.objects.create(deck=deck, flashcard=flashcard)

            return Response({"status": "success", "message": "Flashcard added to the deck successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "error", "message": form.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete_flashcard(self, request, flashcard_id):
        # Retrieve the Flashcard object with the specified flashcard_id or return a 404 error
        flashcard = get_object_or_404(Flashcard, pk=flashcard_id)

        # Check if the authenticated user is the owner of the flashcard
        if request.user == flashcard.user:
             # If the user is the owner, delete the flashcard
            flashcard.delete()
            return Response({"status": "success", "message": "Flashcard deleted successfully."}, status=status.HTTP_200_OK)
        else:
            # If the user is not the owner, return an error response
            return Response({"status": "error", "message": "You do not have permission to delete this flashcard."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, action):
        # Check the action type
        if action == 'edit':
            
            # Get flashcard_id from the request data
            flashcard_id = request.data.get('flashcard_id')
            
            # Check if flashcard_id is provided
            if flashcard_id:
                return self.edit_flashcard(request, flashcard_id)
            else:
                return Response({"status": "error", "message": "Flashcard ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"status": "error", "message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    def edit_flashcard(self, request, flashcard_id):
        try:
             # Retrieve the Flashcard object with the specified flashcard_id that belongs to the authenticated user
            flashcard = Flashcard.objects.get(pk=flashcard_id, user=request.user)
        except Flashcard.DoesNotExist:
            # Return an error response if the flashcard is not found or the user doesn't have permission to edit it
            return Response({"status": "error", "message": "Flashcard not found or you don't have permission to edit it."}, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if they are provided in the request
        term = request.data.get('term', None)
        definition = request.data.get('definition', None)

        # Update the flashcard fields if new values are provided
        if term is not None:
            flashcard.term = term
        if definition is not None:
            flashcard.definition = definition

        # Save the updated flashcard to the database
        flashcard.save()
        return Response({"status": "success", "message": "Flashcard updated successfully."}, status=status.HTTP_200_OK)





# Helper functions

def username_exists(username):
    return User.objects.filter(username=username).exists()


def parse_request_body(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return None
    
def create_jwt_with_user_info(user):
    refresh = RefreshToken.for_user(user)
    refresh['user_id'] = user.id

    access_token = str(refresh.access_token)
    refresh_token = str(refresh)  

    return access_token, refresh_token