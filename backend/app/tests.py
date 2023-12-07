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
            reverse('auth_view', args=['signup']),
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn('access_token', response.json())

    def test_login_view(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
        }
        response = self.client.post(
            reverse('auth_view', args=['login']),
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())

        # Test wrong credentials
        # Wrong Password
        response = self.client.post(
            reverse('auth_view', args=['login']),
            json.dumps({'username': 'testuser', 'password': 'wrongpassword'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Incorrect password.')

        # Wrong Username
        response = self.client.post(
            reverse('auth_view', args=['login']),
            json.dumps({'username': 'wrongtestuser', 'password': 'testpassword'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Incorrect username.')

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
    def test_change_password(self):

        self.client.force_authenticate(user=self.user)

        data = {
            "old_password":"testpassword",
            "new_password1":"newtestpassword",
            "new_password2":"newtestpassword"
        }

        # Make a password change request
        response = self.client.post('/auth/change_password/',data,format='json')

        # Check if response status is ok
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.data['status'],'success')

        self.user.refresh_from_db()

        # Check if password has changed successfully
        self.assertTrue(self.user.check_password('newtestpassword'))

    def test_change_password_invalid_data(self):

        self.client.force_authenticate(user=self.user)

        # Test for invalid data
        invalid_data = {
            "old_password":"testpassword",
            "new_password1":"newtestpassword"
        }
        response = self.client.post('/auth/change_password/',invalid_data,format='json')
        self.assertEqual(response.status_code,400)
        self.assertTrue(response.data['status'],'error')
        self.assertTrue(self.user.check_password,'testpassword')


class DeckTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client = APIClient()
        self.client.login(username='testuser', password='12345')
        # Obtain a token for the test user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    @patch('openai.ChatCompletion.create')
    def test_create_deck_success(self, mock_openai_create):
        # Adjust mock data to match the new expected format
        mock_openai_response = {
            'choices': [
                {
                    'message': {
                        'content': json.dumps({
                            "flashcards": [
                                {"term": "Array", "definition": "Definition of Array"},
                            ]
                        })
                    }
                }
            ]
        }
        mock_openai_create.return_value = mock_openai_response

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        # Include 'deck_name' in the data since your function expects it
        response = self.client.post(reverse('deck_action', args=['create']), {
            'content': 'An array is ...',
            'deck_name': 'Test Deck Name'
        })
        self.assertEqual(response.status_code, 201)

    @patch('openai.ChatCompletion.create')
    def test_create_deck_api_error(self, mock_openai_create):
        mock_openai_create.side_effect = Exception("API Error")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(reverse('deck_action', args=['create']), {'content': 'An array is ...'})
        self.assertEqual(response.status_code, 500)

    def test_delete_unauthorized_deck(self):
        other_user = User.objects.create_user(username='otheruser', password='12345')
        deck = Deck.objects.create(deck_name="Unauthorized Deck", user=other_user)
        response = self.client.post(reverse('deck_action', args=['delete']), {'deck_id': deck.pk})  
        self.assertEqual(response.status_code, 401)

    def test_delete_forbidden_deck(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        # Create a deck belonging to user2
        deck = Deck.objects.create(deck_name="Forbidden Deck", user=self.user2)

        # Attempt to delete the deck as user1
        response = self.client.post(reverse('deck_action', args=['delete']), {'deck_id': deck.pk})

        # Check the status code and message
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()['message'], "You do not have permission to delete this deck.")

class FlashcardTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client = APIClient()   
        self.client.login(username='testuser', password='12345')
        # Obtain a token for the test user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_create_flashcard_invalid_form(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(
            reverse('flashcards', args=['create']),
            {'term': '', 'definition': ''},  # Missing term and definition
            format='json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_delete_unauthorized_flashcard(self):
        other_user = User.objects.create_user(username='otheruser', password='12345')
        flashcard = Flashcard.objects.create(term="Unauthorized Term", definition="Unauthorized Definition", user=other_user)
        
        response = self.client.post(
            reverse('flashcards', args=['delete']),
            {'flashcard_id': flashcard.flashcard_id},
            format='json'
        )
        self.assertEqual(response.status_code, 401)  

    def test_edit_flashcard(self):
        flashcard = Flashcard.objects.create(term="Original Term", definition="Original Definition", user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.put(
            reverse('flashcards', args=['edit']),
            {'flashcard_id': flashcard.flashcard_id, 'term': 'Updated Term', 'definition': 'Updated Definition'},
            format='json'
        )
        self.assertEqual(response.status_code, 200)  # OK
        self.assertEqual(response.json()['message'], "Flashcard updated successfully.")

