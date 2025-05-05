import React, { useEffect, useState } from 'react';
import { getDecks, createDeck } from '../api/flashcardApi';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/Home.css';

Modal.setAppElement('#root');

const Home = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isDeckModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isDeckModalOpen]);

    const fetchDecks = async () => {
        try {
            const data = await getDecks();
            setDecks(Array.isArray(data) ? data : data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDecks();
    }, []);

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        try {
            const newDeck = await createDeck({ name: newDeckName });
            setDecks([...decks, newDeck]);
            setIsDeckModalOpen(false);
            setNewDeckName('');
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create deck');
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading your decks...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Flashcard Master</h1>
                <p>Organize your learning materials</p>
            </header>

            <main className="main-content">
                <div className="content-container">
                    <div className="decks-header">
                        <h2>Your Decks</h2>
                        <button 
                            onClick={() => setIsDeckModalOpen(true)} 
                            className="create-button"
                        >
                            + New Deck
                        </button>
                    </div>

                    {error && !isDeckModalOpen && (
                        <div className="error-message">
                            {error}
                            <button onClick={fetchDecks} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {decks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <h3>No decks yet</h3>
                            <p>Create your first deck to get started</p>
                            <button 
                                onClick={() => setIsDeckModalOpen(true)} 
                                className="create-button"
                            >
                                Create Deck
                            </button>
                        </div>
                    ) : (
                        <div className="decks-grid">
                            {decks.map((deck) => (
                                <div className="deck-card" key={deck.id}>
                                    <div className="deck-info">
                                        <h3>{deck.name}</h3>
                                        <p>{deck.cardsCount || 0} cards</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/decks/${deck.id}`)}
                                        className="study-button"
                                    >
                                        Study
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Modal
                isOpen={isDeckModalOpen}
                onRequestClose={() => setIsDeckModalOpen(false)}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Create New Deck</h2>
                        <button 
                            onClick={() => setIsDeckModalOpen(false)} 
                            className="close-button"
                        >
                            &times;
                        </button>
                    </div>
                    <form onSubmit={handleCreateDeck}>
                        <div className="form-group">
                            <label>Deck Name</label>
                            <input
                                type="text"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                placeholder="Enter deck name"
                                autoFocus
                                required
                            />
                        </div>
                        {error && <div className="form-error">{error}</div>}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                onClick={() => setIsDeckModalOpen(false)}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={!newDeckName.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Home;