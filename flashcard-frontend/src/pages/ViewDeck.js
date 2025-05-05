import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { getDeck } from '../api/flashcardApi';

function ViewDeck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    try {
        getDeck(deckId).then((data) => {
            console.log('Fetched deck:', data); // Debugging line to check fetched data
            setDeck(data.data);
        });
    } catch (error) {
        console.error('Error fetching deck:', error);   
    }
  }, [deckId]); // Added deckId to the dependency array

  if (!deck) return <div>Loading...</div>;

  return (
    <div>
      <h1>{deck.name}</h1>
      <p>{deck.description}</p>
      <button onClick={() => navigate('/decks/new')} className="button">Create New Deck</button>
    </div>
  );
}

export default ViewDeck;