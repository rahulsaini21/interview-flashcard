import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ViewFlashcard() {
  const { deckId, flashcardId } = useParams();
  const [flashcard, setFlashcard] = useState(null);

  useEffect(() => {
    fetch(`/api/decks/${deckId}/flashcards/${flashcardId}`)
      .then((response) => response.json())
      .then((data) => setFlashcard(data));
  }, [deckId, flashcardId]);

  if (!flashcard) return <div>Loading...</div>;

  return (
    <div>
      <h1>{flashcard.question}</h1>
      <p>{flashcard.answer}</p>
    </div>
  );
}

export default ViewFlashcard;