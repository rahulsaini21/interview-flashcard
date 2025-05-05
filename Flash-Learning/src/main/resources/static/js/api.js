const api = {
    baseUrl: '/api',

    async request(endpoint, method = 'GET', data = null) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }
        return response.json();
    },

    // Deck endpoints
    getDecks() {
        return this.request('/decks');
    },

    getDeck(id) {
        return this.request(`/decks/${id}`);
    },

    getSubDecks(parentId) {
        return this.request(`/decks?parentId=${parentId}`);
    },

    createDeck(deck) {
        return this.request('/decks', 'POST', deck);
    },

    // Flashcard endpoints
    getFlashcards(deckId) {
        return this.request(`/decks/${deckId}/flashcards`);
    },

    createFlashcard(deckId, flashcard) {
        return this.request(`/decks/${deckId}/flashcards`, 'POST', flashcard);
    }
};