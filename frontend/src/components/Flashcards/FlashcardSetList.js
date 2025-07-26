// flashcards-frontend/src/components/Flashcards/FlashcardSetList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FlashcardSetList() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sets/');
      setSets(response.data);
    } catch (err) {
      setError('Failed to fetch flashcard sets. Please check if the backend is running.');
      console.error("Error fetching flashcard sets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const handleCreateSet = async (e) => {
    e.preventDefault();
    if (!newSetName.trim()) {
      alert('Set name cannot be empty.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/sets/', {
        name: newSetName,
        description: newSetDescription
      });
      setNewSetName('');
      setNewSetDescription('');
      fetchFlashcardSets(); // Refresh the list
    } catch (err) {
      setError('Failed to create flashcard set.');
      console.error("Error creating set:", err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteSet = async (setId, setName) => {
    if (window.confirm(`Are you sure you want to delete the set "${setName}" and all its flashcards? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:8000/api/sets/${setId}/`);
        alert(`Set "${setName}" deleted successfully!`);
        fetchFlashcardSets(); // Refresh the list after deletion
      } catch (err) {
        setError(`Failed to delete set "${setName}".`);
        console.error("Error deleting set:", err.response ? err.response.data : err.message);
      }
    }
  };

  if (loading) return <p>Loading flashcard sets...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2 style={{color: '#f0f0f0'}}>Flashcard Sets</h2>

      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#007bff' }}>
        <h3>Create New Set</h3>
        <form onSubmit={handleCreateSet}>
          <div style={{ marginBottom: '10px' }}>
        <label htmlFor="setName" style={{ display: 'block', marginBottom: '5px' }}>Set Name:</label>
        <input
            type="text"
            id="setName"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc', 
            backgroundColor: '#AFDBF5' 
            }}
            required
        />
        </div>
        <div style={{ marginBottom: '15px' }}>
        <label htmlFor="setDescription" style={{ display: 'block', marginBottom: '5px' }}>Description (Optional):</label>
        <textarea
            id="setDescription"
            value={newSetDescription}
            onChange={(e) => setNewSetDescription(e.target.value)}
            rows="2"
            style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            backgroundColor: '#AFDBF5'
            }}
        />
        </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Create Set
          </button>
        </form>
      </div>

      {sets.length === 0 ? (
        <p>No flashcard sets yet. Create one above!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sets.map(set => (
            <div key={set.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3><Link to={`/sets/${set.id}/flashcards`} style={{ textDecoration: 'none', color: 'white' }}>{set.name}</Link></h3>
              {set.description && <p style={{ fontSize: '0.9em', color: '#fff' }}>{set.description}</p>}
              <p style={{ fontSize: '0.8em', color: '#fff' }}>{set.flashcard_count} cards</p>
              <div style={{ marginTop: '10px' }}>
                <Link to={`/sets/${set.id}/flashcards`} style={{ display: 'inline-block', marginRight: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                  View Cards
                </Link>
                {/* NEW: Edit Button for Set */}
                <Link to={`/sets/edit/${set.id}`} style={{ display: 'inline-block', marginRight: '10px', padding: '8px 12px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                  Edit Set
                </Link>
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteSet(set.id, set.name)}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete Set
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardSetList;