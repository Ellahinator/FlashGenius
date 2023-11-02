from rest_framework import serializers
from .models import Deck, Flashcard, DeckFlashcard

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ('flashcard_id', 'term', 'definition')

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ('deck_id', 'deck_name')

class DeckFlashcardSerializer(serializers.ModelSerializer):
    flashcard = FlashcardSerializer()

    class Meta:
        model = DeckFlashcard
        fields = ('position', 'flashcard')
