import json
from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient
from app.models import Deck, Flashcard

class AuthenticationTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()

    def test_signup_view(self):
        data = {
            "username": "newtestuser",
            "email": "newtestuser@example.com",
            "password1": "testpassword",
            "password2": "testpassword",
        }
        response = self.client.post(
            reverse('signup_view'),
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())

    def test_login_view(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
        }
        response = self.client.post(
            reverse('login_view'),
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())

        # Test wrong credentials
        # Wrong Password
        response = self.client.post(
            reverse('login_view'),
            json.dumps({'username': 'testuser', 'password': 'wrongpassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'error')

        # Wrong Username
        response = self.client.post(
            reverse('login_view'),
            json.dumps({'username': 'wrongtestuser', 'password': 'testpassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'error')

    def test_protected_view(self):
        # Obtain a JWT token
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        # Access protected view with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(reverse('protected'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'You are authenticated.')

        # Access protected view without token
        self.client.credentials()
        response = self.client.get(reverse('protected'))
        self.assertEqual(response.status_code, 401)  # Unauthorized

# Create your tests here.
class FlashcardTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')

    @patch('openai.ChatCompletion.create')
    def test_create_deck_success(self, mock_openai_create):
        mock_openai_create.return_value = {
            'choices': [
                {'message': {'content': '[{"name": "Data Structures"}, {"term": "Array", "definition": "Definition of Array"}]'}}
            ]
        }
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('create_deck'), {'content': 'An array is ...'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')

    @patch('openai.ChatCompletion.create')
    def test_create_deck_api_error(self, mock_openai_create):
        mock_openai_create.side_effect = Exception("API Error")
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('create_deck'), {'content': 'An array is ...'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'error')

    def test_create_flashcard_invalid_form(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('create_flashcard'), {'term': '', 'definition': ''})  # Missing term and definition
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'error')

    def test_delete_unauthorized_deck(self):
        other_user = User.objects.create_user(username='otheruser', password='12345')
        deck = Deck.objects.create(deck_name="Unauthorized Deck", user=other_user)
        
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('delete_deck', args=[deck.deck_id]))
        self.assertEqual(response.json()['status'], 'error')

    def test_delete_unauthorized_flashcard(self):
        other_user = User.objects.create_user(username='otheruser', password='12345')
        flashcard = Flashcard.objects.create(term="Unauthorized Term", definition="Unauthorized Definition", user=other_user)
        
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('delete_flashcard', args=[flashcard.flashcard_id]))
        self.assertEqual(response.json()['status'], 'error')