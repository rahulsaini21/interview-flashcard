import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DeckForm from './pages/DeckForm';
import FlashcardList from './pages/FlashcardList';
import FlashcardForm from './pages/FlashcardForm';
import NotFound from './pages/NotFound';
import ViewDeck from './pages/ViewDeck'
import ViewFlashcard from './pages/ViewFlashcard';
import './App.css';
import DeckList from './pages/DeckList';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './pages/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/decks/new" element={<ProtectedRoute><DeckForm /></ProtectedRoute>} />
          <Route path="/decks/:deckId" element={<ProtectedRoute><DeckList /></ProtectedRoute>} />
          <Route path="/decks/:deckId/flashcards" element={<ProtectedRoute><FlashcardList /></ProtectedRoute>} />
          <Route path="/decks/:deckId/flashcards/new" element={<ProtectedRoute><FlashcardForm /></ProtectedRoute>} />
          <Route path="/decks/:deckId/flashcards/:flashcardId" element={<ProtectedRoute><ViewFlashcard /></ProtectedRoute>} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;