// flashcards-frontend/src/components/Flashcards/FlashcardSetForm.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FlashcardSetForm() {
  const { setId } = useParams(); // Will be defined if editing a set
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isEditing = setId ? true : false;

  useEffect(() => {
    if (isEditing) {
      const fetchFlashcardSet = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/sets/${setId}/`);
          setName(response.data.name);
          setDescription(response.data.description || ''); // Handle null description
        } catch (err) {
          setError('Failed to load flashcard set for editing. It might not exist or the backend is down.');
          console.error("Error fetching flashcard set for edit:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFlashcardSet();
    } else {
      setLoading(false); // No loading if creating new
    }
  }, [setId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!name.trim()) {
      setError('Set name is required.');
      return;
    }

    const set_data = {
      name,
      description: description.trim() === '' ? null : description // Send null if description is empty
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/sets/${setId}/`, set_data);
        alert('Flashcard set updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/sets/', set_data);
        alert('Flashcard set created successfully!');
      }
      navigate('/'); // Go back to the list of sets after submission
    } catch (err) {
      setError('Failed to save flashcard set. Please check the form and try again.');
      console.error("Error saving set:", err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
      <h2 style={{ color: 'white' }}>
        {isEditing ? 'Edit Flashcard Set' : 'Create New Flashcard Set'}
      </h2>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="setName" style={{ display: 'block', marginBottom: '5px' }}>Set Name:</label>
          <input
            type="text"
            id="setName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#AFDBF5'  }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="setDescription" style={{ display: 'block', marginBottom: '5px' }}>Description (Optional):</label>
          <textarea
            id="setDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#AFDBF5'  }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isEditing ? 'Update Set' : 'Create Set'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
        </button>
      </form>
    </div>
  );
}

export default FlashcardSetForm;