from django.contrib import admin

# Register your models here.

from .models import Deck,DeckFlashcard,Flashcard

admin.site.register(Deck)
admin.site.register(DeckFlashcard)
admin.site.register(Flashcard)