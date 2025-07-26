from django.urls import path
from .views import (
    FlashcardListCreateView, FlashcardRetrieveUpdateDestroyView,
    FlashcardSetListCreateView, FlashcardSetRetrieveUpdateDestroyView
)

urlpatterns = [
    # Flashcard Set URLs
    path('sets/', FlashcardSetListCreateView.as_view(), name='flashcardset-list-create'),
    path('sets/<int:pk>/', FlashcardSetRetrieveUpdateDestroyView.as_view(), name='flashcardset-detail'),

    # Flashcard URLs (can now be filtered by set_id using ?set_id=X)
    path('flashcards/', FlashcardListCreateView.as_view(), name='flashcard-list-create'),
    path('flashcards/<int:pk>/', FlashcardRetrieveUpdateDestroyView.as_view(), name='flashcard-detail'),
]