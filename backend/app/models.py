from django.db import models
from django.contrib.auth.models import AbstractBaseUser, User
from django.contrib.auth.hashers import make_password, check_password


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Deck(BaseModel):
    deck_id = models.AutoField(primary_key=True)
    deck_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, related_name='decks', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('deck_name', 'user')

class Flashcard(BaseModel):
    flashcard_id = models.AutoField(primary_key=True)
    term = models.TextField()
    definition = models.TextField()
    user = models.ForeignKey(User, related_name='flashcards', on_delete=models.CASCADE)

class DeckFlashcard(models.Model):
    deck = models.ForeignKey(Deck, related_name='flashcards', on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    position = models.IntegerField()

    class Meta:
        unique_together = ('deck', 'position')
        index_together = ['position']

    def save(self, *args, **kwargs):
        if not self.position:
            max_position = DeckFlashcard.objects.filter(deck=self.deck).aggregate(models.Max('position'))['position__max']
            self.position = max_position + 1 if max_position else 1
        super().save(*args, **kwargs)