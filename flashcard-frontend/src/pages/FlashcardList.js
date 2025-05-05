import React, { useEffect, useState } from 'react';
import { getFlashcards } from '../api/flashcardApi';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

const FlashcardList = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {deckId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!deckId) {
            console.error('No deckId provided in the URL');
            navigate('/');
            return;
        }

        const fetchFlashcards = async () => {
            try {
                console.log('Fetching flashcards for deckId:', deckId); // Debugging line to check deckId
                const data = await getFlashcards(deckId);
                console.log('Fetched flashcards:', data); // Debugging line to check fetched data
                setFlashcards(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        console.log('Fetching flashcards...', deckId); // Debugging line to indicate fetching process
        fetchFlashcards();
    }, [deckId, navigate]);

    if (!deckId) return null;

    if (loading) {
        return <p>Loading flashcards...</p>;
    }

    if (error) {
        return <p>Failed to load flashcards: {error}</p>;
    }

    return (
        <div>
            <h1>Flashcards</h1>
            <div id="flashcards-list">
                {flashcards.length === 0 ? (
                    <p>No flashcards found</p>
                ) : (
                    flashcards.map((card) => (
                        <div className="flashcard" key={card.id}>
                            <h3>{card.question}</h3>
                            <p>{card.answer}</p>
                            {card.description && <p>{card.description}</p>}
                        </div>
                    ))
                )}
            </div>
            <a 
                href={`/create-card?deckId=${deckId}`} 
                id="create-card-link" 
                className="button"
            >
                Create New Flashcard
            </a>
            <a href="/" className="button">Back to Decks</a>
        </div>
    );
};

export default FlashcardList;