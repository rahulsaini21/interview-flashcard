import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token found:', token); // Debugging line to check token
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', config); // Debugging line to check request config
  return config;
});

export const getDecks = () => api.get('/decks');
export const createDeck = (deck) => api.post('/decks', deck);
export const createSubDeck = (deck, parentId) => api.post(`/decks?parentId=${parentId}`, deck);
export const getDeck = (id) => api.get(`/decks/${id}`);
export const deleteDeck = (id) => api.delete(`/decks/${id}`);
export const getSubDecks = (parentId) => api.get(`/decks?parentId=${parentId}`);

export const getFlashcards = (deckId) => api.get(`/decks/${deckId}/flashcards`);
export const createFlashcard = (deckId, flashcard) => api.post(`/decks/${deckId}/flashcards`, flashcard);
export const deleteFlashcard = (deckId, id) => api.delete(`/decks/${deckId}/flashcards/${id}`);

// export const getDeck = (deckId) => api.get(`/decks/${deckId}`);
// export const deleteDeck = (id) => api.delete(`/decks/${id}`);
// export const deleteFlashcard = (deckId, id) => api.delete(`/decks/${deckId}/flashcards/${id}`);