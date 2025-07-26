// flashcards-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlashcardSetList from './components/Flashcards/FlashcardSetList';
import FlashcardList from './components/Flashcards/FlashcardList';
import FlashcardDetail from './components/Flashcards/FlashcardDetail';
import FlashcardForm from './components/Flashcards/FlashcardForm';
import FlashcardSetForm from './components/Flashcards/FlashcardSetForm';
import FlashcardManageList from './components/Flashcards/FlashcardManageList'; // NEW IMPORT

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1E90FF' }}>
          <h1>Flashcards App</h1>
          <nav>
            <a href="/" style={{ margin: '0 10px', textDecoration: 'none', color: '#fff' }}>Home (Sets)</a>
          </nav>
        </header>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<FlashcardSetList />} />
            <Route path="/sets/:setId/flashcards" element={<FlashcardList />} />
            <Route path="/flashcards/:id" element={<FlashcardDetail />} />
            <Route path="/flashcards/new" element={<FlashcardForm />} />
            <Route path="/flashcards/edit/:id" element={<FlashcardForm />} />
            <Route path="/sets/edit/:setId" element={<FlashcardSetForm />} />
            {/* Route for managing flashcards within a set */}
            <Route path="/sets/:setId/manage-flashcards" element={<FlashcardManageList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;