from rest_framework import generics
from .models import Flashcard, FlashcardSet
from .serializers import FlashcardSerializer, FlashcardSetSerializer

class FlashcardSetListCreateView(generics.ListCreateAPIView):
    queryset = FlashcardSet.objects.all()
    serializer_class = FlashcardSetSerializer

class FlashcardSetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FlashcardSet.objects.all()
    serializer_class = FlashcardSetSerializer

class FlashcardListCreateView(generics.ListCreateAPIView):
    serializer_class = FlashcardSerializer

    def get_queryset(self):
        # Allow filtering flashcards by set_id
        set_id = self.request.query_params.get('set_id')
        if set_id:
            return Flashcard.objects.filter(flashcard_set__id=set_id)
        return Flashcard.objects.all()

class FlashcardRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer