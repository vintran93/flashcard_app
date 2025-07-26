import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FlashcardManageList() {
  const { setId } = useParams(); // Get set ID from URL if managing cards within a set
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setName, setSetName] = useState('All'); // To display the set name

  const fetchFlashcards = async () => {
    try {
      let url = 'http://localhost:8000/api/flashcards/';
      if (setId) {
        url += `?set_id=${setId}`; // Filter by set_id if present
        // Fetch set details to display set name
        const setResponse = await axios.get(`http://localhost:8000/api/sets/${setId}/`);
        setSetName(setResponse.data.name);
      } else {
          setSetName('All'); // Default for no set ID
      }

      const response = await axios.get(url);
      setFlashcards(response.data);
    } catch (err) {
      setError('Failed to fetch flashcards for management. Please check if the backend is running.');
      console.error("Error fetching flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [setId]); // Re-fetch when setId changes

  const handleDelete = async (cardId, cardQuestion) => {
    if (window.confirm(`Are you sure you want to delete the flashcard: "${cardQuestion}"?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/flashcards/${cardId}/`);
        alert('Flashcard deleted successfully!');
        fetchFlashcards(); // Refresh the list after deletion
      } catch (err) {
        setError('Failed to delete flashcard.');
        console.error("Error deleting flashcard:", err.response ? err.response.data : err.message);
      }
    }
  };

  if (loading) return <p>Loading flashcards...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h2>Manage Flashcards {setName !== 'All' ? `in "${setName}" Set` : ''}</h2>
      <div style={{ marginBottom: '20px' }}>
        <Link to={setId ? `/sets/${setId}/flashcards` : '/'} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          {setId ? `Back to "${setName}" Cards` : 'Back to Sets'}
        </Link>
      </div>
      {flashcards.length === 0 ? (
        <p>No flashcards to manage in this set yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {flashcards.map(flashcard => (
            <div key={flashcard.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>{flashcard.question}</h3>
              <p style={{ fontSize: '0.9em', color: '#666' }}>Answer: {flashcard.answer}</p>
              <div style={{ marginTop: '15px' }}>
                <Link to={`/flashcards/edit/${flashcard.id}`} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(flashcard.id, flashcard.question)}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardManageList;