import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function FlashcardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flashcard, setFlashcard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/flashcards/${id}/`);
        setFlashcard(response.data);
      } catch (err) {
        setError('Failed to fetch flashcard. It might not exist or the backend is down.');
        console.error("Error fetching flashcard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcard();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await axios.delete(`http://localhost:8000/api/flashcards/${id}/`);
        alert('Flashcard deleted successfully!');
        navigate('/'); // Go back to list after deletion
      } catch (err) {
        setError('Failed to delete flashcard.');
        console.error("Error deleting flashcard:", err);
      }
    }
  };

  if (loading) return <p>Loading flashcard...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!flashcard) return <p>Flashcard not found.</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
      <h2>Flashcard Details</h2>
      <p><strong>Question:</strong> {flashcard.question}</p>
      <p><strong>Answer:</strong> {flashcard.answer}</p>
      <p><em>Created: {new Date(flashcard.created_at).toLocaleDateString()}</em></p>
      <p><em>Last Updated: {new Date(flashcard.updated_at).toLocaleDateString()}</em></p>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/flashcards/edit/${flashcard.id}`} style={{ marginRight: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Edit</Link>
        <button onClick={handleDelete} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
        <Link to="/" style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Back to List</Link>
      </div>
    </div>
  );
}

export default FlashcardDetail;