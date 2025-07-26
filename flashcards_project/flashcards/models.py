from django.db import models

class FlashcardSet(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name'] # Order sets alphabetically by default

    def __str__(self):
        return self.name

class Flashcard(models.Model):
    flashcard_set = models.ForeignKey(
        FlashcardSet,
        on_delete=models.CASCADE,
        related_name='flashcards', # Access flashcards from a set: my_set.flashcards.all()
        null=True,  # Allow existing cards to not belong to a set initially
        blank=True  # Allow initial forms to be blank
    )
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Q: {self.question[:50]} - A: {self.answer[:50]}"