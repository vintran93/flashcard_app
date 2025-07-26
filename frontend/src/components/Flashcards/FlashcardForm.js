import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import axios from 'axios';

function FlashcardForm() {
  const { id } = useParams(); // Will be defined if editing a flashcard
  const navigate = useNavigate();
  const location = useLocation(); // To get query parameters (like ?set_id=X)

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedSet, setSelectedSet] = useState(''); // State for selected set ID
  const [flashcardSets, setFlashcardSets] = useState([]); // To populate dropdown

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isEditing = id ? true : false;

  useEffect(() => {
    const fetchSetsAndFlashcard = async () => {
      try {
        // Fetch all sets for the dropdown
        const setsResponse = await axios.get('http://localhost:8000/api/sets/');
        setFlashcardSets(setsResponse.data);

        if (isEditing) {
          // If editing, fetch existing flashcard details
          const flashcardResponse = await axios.get(`http://localhost:8000/api/flashcards/${id}/`);
          setQuestion(flashcardResponse.data.question);
          setAnswer(flashcardResponse.data.answer);
          setSelectedSet(flashcardResponse.data.flashcard_set || ''); // Set existing set
        } else {
          // If creating new, check for set_id in query params (e.g., from "Create in this Set" button)
          const queryParams = new URLSearchParams(location.search);
          const setIdFromQuery = queryParams.get('set_id');
          if (setIdFromQuery) {
            setSelectedSet(setIdFromQuery);
          }
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSetsAndFlashcard();
  }, [id, isEditing, location.search]); // Depend on location.search to react to query param changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!question || !answer) {
      setError('Both question and answer are required.');
      return;
    }

    const flashcardData = {
      question,
      answer,
      flashcard_set: selectedSet || null // Send null if no set is selected
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/flashcards/${id}/`, flashcardData);
        alert('Flashcard updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/flashcards/', flashcardData);
        alert('Flashcard created successfully!');
      }
      // Navigate back to the list of flashcards in the relevant set, or to main sets list
      if (selectedSet) {
        navigate(`/sets/${selectedSet}/flashcards`);
      } else {
        navigate('/'); // If no set was selected, go back to the main set list
      }

    } catch (err) {
      setError('Failed to save flashcard. Please check the form and try again.');
      console.error("Error saving flashcard:", err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
      <h2>{isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="flashcardSet" style={{ display: 'block', marginBottom: '5px' }}>Assign to Set:</label>
          <select
            id="flashcardSet"
            value={selectedSet}
            onChange={(e) => setSelectedSet(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">-- No Set --</option>
            {flashcardSets.map(set => (
              <option key={set.id} value={set.id}>{set.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="question" style={{ display: 'block', marginBottom: '5px' }}>Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="answer" style={{ display: 'block', marginBottom: '5px' }}>Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isEditing ? 'Update Flashcard' : 'Create Flashcard'}
        </button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
        </button>
      </form>
    </div>
  );
}

export default FlashcardForm;