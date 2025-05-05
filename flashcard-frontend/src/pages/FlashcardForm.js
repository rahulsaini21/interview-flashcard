import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createFlashcard } from '../api/flashcardApi';

const FlashcardForm = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [description, setDescription] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const deckId = useParams().deckId;

    useEffect(() => {
        if (!deckId) {
            console.error('No deckId provided in the URL');
            navigate('/');
        }
    }, [deckId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createFlashcard(deckId, { question, answer, description });
            navigate(`/flashcards?deckId=${deckId}`);
        } catch (error) {
            alert(`Failed to create flashcard: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Create New Flashcard</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="question">Question:</label>
                <input
                    type="text"
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />

                <label htmlFor="answer">Answer:</label>
                <input
                    type="text"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />

                <label htmlFor="description">Description (optional):</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit">Create</button>
                <button type="button" onClick={() => navigate(`/flashcards?deckId=${deckId}`)}>Cancel</button>
            </form>
        </div>
    );
};

export default FlashcardForm;