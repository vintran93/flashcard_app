import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FlashcardList() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setName, setSetName] = useState('All');

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        let url = 'http://localhost:8000/api/flashcards/';
        if (setId) {
          url += `?set_id=${setId}`;
          const setResponse = await axios.get(`http://localhost:8000/api/sets/${setId}/`);
          setSetName(setResponse.data.name);
        } else {
            setSetName('All');
        }

        const response = await axios.get(url);
        // Initialize each flashcard with a 'flipped' state
        setFlashcards(response.data.map(card => ({ ...card, isFlipped: false })));
      } catch (err) {
        setError('Failed to fetch flashcards. Please check if the backend is running and the set ID is valid.');
        console.error("Error fetching flashcards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [setId]);

  const handleCreateNewFlashcard = () => {
    if (setId) {
      navigate(`/flashcards/new?set_id=${setId}`);
    } else {
      navigate('/flashcards/new');
    }
  };

  // Function to toggle the flipped state of a flashcard
  const toggleFlip = (cardId) => {
    setFlashcards(prevFlashcards =>
      prevFlashcards.map(card =>
        card.id === cardId ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };

  // Determine the path for managing flashcards based on whether a set ID exists
  const manageFlashcardsPath = setId ? `/sets/${setId}/manage-flashcards` : '/manage-flashcards';

  if (loading) return <p style={{color: '#f0f0f0'}}>Loading flashcards...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h2>Flashcards in "{setName}" Set</h2>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreateNewFlashcard}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', textDecoration: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Create New Flashcard {setId ? `for ${setName}` : ''}
        </button>
        <Link to={manageFlashcardsPath} style={{ marginRight: '10px', padding: '10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Edit Cards
        </Link>
        <Link to="/" style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Back to Sets
        </Link>
      </div>
      {flashcards.length === 0 ? (
        <p style={{color: '#f0f0f0'}}>No flashcards in this set yet. Why not create one?</p> 
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', /* Adjusted width for better card display */
          gap: '20px',
          perspective: '1000px' /* For 3D effect */
        }}>
          {flashcards.map(flashcard => (
            <div
              key={flashcard.id}
              onClick={() => toggleFlip(flashcard.id)}
              style={{
                backgroundColor: '#fff',
                border: '3px solid #007bff', /* BLUE BORDER ADDED */
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)', /* Slightly darker shadow for dark background */
                position: 'relative',
                width: '100%',
                height: '200px', /* Fixed height for consistent flipping */
                cursor: 'pointer',
                transformStyle: 'preserve-3d', /* Crucial for 3D flip */
                transition: 'transform 0.6s', /* Smooth transition */
                transform: flashcard.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden', /* Hide back when not flipped */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                {/* Front of the card (Question) */}
                <h3 style={{ margin: 0, color: '#333' }}>{flashcard.question}</h3>
              </div>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden', /* Hide back when not flipped */
                transform: 'rotateY(180deg)', /* Rotated for the back side */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '##87CEEB', /* Different background for answer side */
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}>
                {/* Back of the card (Answer) */}
                <p style={{ margin: 0, color: '#555' }}>{flashcard.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardList;