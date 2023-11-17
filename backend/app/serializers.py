from rest_framework import serializers
from .models import Deck, Flashcard, DeckFlashcard

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ('flashcard_id', 'term', 'definition')

class DeckSerializer(serializers.ModelSerializer):
    term_count = serializers.SerializerMethodField()
    class Meta:
        model = Deck
        fields = ('deck_id', 'deck_name', 'term_count')

    def get_term_count(self, obj):
        return obj.flashcards.count()

class DeckFlashcardSerializer(serializers.ModelSerializer):
    flashcard = FlashcardSerializer()

    class Meta:
        model = DeckFlashcard
        fields = ('position', 'flashcard')
