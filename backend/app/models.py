from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    deck_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Flashcard(models.Model):
    flashcard_id = models.AutoField(primary_key=True)
    term = models.TextField()
    definition = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    decks = models.ManyToManyField(Deck, through='DeckFlashcard')


class DeckFlashcard(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
