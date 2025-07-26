from rest_framework import serializers
from .models import Flashcard, FlashcardSet

class FlashcardSetSerializer(serializers.ModelSerializer):
    # Optional: include the count of flashcards in the set
    flashcard_count = serializers.SerializerMethodField()

    class Meta:
        model = FlashcardSet
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'flashcard_count']
        read_only_fields = ['created_at', 'updated_at', 'flashcard_count']

    def get_flashcard_count(self, obj):
        return obj.flashcards.count()


class FlashcardSerializer(serializers.ModelSerializer):
    # Make flashcard_set readable and writable by its ID
    flashcard_set = serializers.PrimaryKeyRelatedField(
        queryset=FlashcardSet.objects.all(),
        allow_null=True,
        required=False
    )
    # Optional: Display set name in read-only nested serializer
    flashcard_set_name = serializers.CharField(source='flashcard_set.name', read_only=True)


    class Meta:
        model = Flashcard
        fields = '__all__' # Or specify fields: ['id', 'question', 'answer', 'flashcard_set', 'flashcard_set_name']