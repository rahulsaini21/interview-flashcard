import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createDeck, createSubDeck } from '../api/flashcardApi';

function DeckForm() {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setParentId(searchParams.get('parentId'));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parentId){
        console.log('Creating subdeck with parentId:', parentId); // Debugging line to check parentId
        console.log('Creating subdeck with name:', name); // Debugging line to check name
        await createSubDeck({name}, parentId );
        navigate(`/decks/${parentId}`);
      }else{
        await createDeck({ name});
        navigate(parentId ? `/decks/${parentId}` : '/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="deck-form">
      <h2>{parentId ? 'Create Subdeck' : 'Create New Deck'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Deck Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default DeckForm;