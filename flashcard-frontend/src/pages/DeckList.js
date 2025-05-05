import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeck, deleteFlashcard, deleteDeck, createFlashcard, createDeck, createSubDeck } from '../api/flashcardApi';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';
import '../css/DeckList.css';

Modal.setAppElement('#root');

function DeckList() {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('CLOSED');
  const [cameraError, setCameraError] = useState(null);
  const [recording, setRecording] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newFlashcard, setNewFlashcard] = useState({
    question: '',
    answer: ''
  });
  const navigate = useNavigate();
  const { deckId } = useParams();
  const { user, logout } = useAuth();

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const fetchDeck = useCallback(async () => {
    try {
      if (deckId) {
        const response = await getDeck(deckId);
        setDeck(response.data);
        setFlashcards(response.data.flashcards.map(fc => ({ ...fc, showAnswer: false })));
      } else {
        setError('No deckId provided');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    fetchDeck();
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stopRecording();
      }
    };
  }, [fetchDeck]);

  const handleCreateSubdeck = async (e) => {
    e.preventDefault();
    try {
      const response = await createSubDeck({
        name: newDeckName},
        deckId
      );
      setDeck(prev => ({
        ...prev,
        subDecks: [...prev.subDecks, response.data]
      }));
      setNewDeckName('');
      setShowDeckModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subdeck');
    }
  };

  const handleCreateNewFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await createFlashcard(deckId, newFlashcard);
      setFlashcards(prev => [...prev, { ...response.data, showAnswer: false }]);
      setNewFlashcard({ question: '', answer: '' });
      setShowFlashcardModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flashcard');
    }
  };

  const handleOpenCamera = () => {
    setCameraError(null);
    setCameraStatus('OPEN');
  };

  const handleStartRecording = async () => {
    try {
      const stream = webcamRef.current.video.srcObject;
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaRecorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        recorderType: RecordRTC.MediaStreamRecorder,
        disableLogs: true,
        bitsPerSecond: 128000
      });

      mediaRecorderRef.current.startRecording();
      setCameraStatus('RECORDING');
    } catch (error) {
      setCameraError('Could not start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        setRecording(URL.createObjectURL(blob));
      });
      setCameraStatus('OPEN');
    } catch (error) {
      setCameraError('Could not stop recording');
    }
  };

  const handleDownloadRecording = () => {
    if (!recording) return;
    const a = document.createElement('a');
    a.href = recording;
    a.download = `recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCloseCamera = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording();
    }
    setRecording(null);
    setCameraStatus('CLOSED');
  };

  const handleToggleAnswer = (flashcardId) => {
    setFlashcards(prev => 
      prev.map(fc => 
        fc.id === flashcardId ? { ...fc, showAnswer: !fc.showAnswer } : fc
      )
    );
  };

  const handleCardDelete = async (flashcardId) => {
    try {
      await deleteFlashcard(deckId, flashcardId);
      setFlashcards(prev => prev.filter(fc => fc.id !== flashcardId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleDeckDelete = async (id) => {
    try {
      await deleteDeck(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!deck) return <div className="error">Deck not found</div>;

  return (
    <div className="three-column-layout">
      {/* Left Column - Subdecks */}
      <div className="subdecks-column">
        <div className="column-header">
          <h2>Subdecks</h2>
          <button 
            className="btn-create" 
            onClick={() => setShowDeckModal(true)}
          >
            + New
          </button>
        </div>
        
        <div className="subdecks-list">
          {deck.subDecks && deck.subDecks.length > 0 ? (
            deck.subDecks.map(subDeck => (
              <div 
                key={subDeck.id} 
                className="subdeck-item"
                onClick={() => navigate(`/decks/${subDeck.id}`)}
              >
                <span className="subdeck-icon">📁</span>
                <span className="subdeck-name">{subDeck.name}</span>
                <button 
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeckDelete(subDeck.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="no-subdecks">
              <p>No subdecks available</p>
            </div>
          )}
        </div>
      </div>

      {/* Center Column - Camera */}
      <div className="camera-column">
        <div className="column-header">
          <h2>Recording Studio</h2>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
        
        <div className="camera-container">
          {cameraError && <div className="error-message">{cameraError}</div>}
          
          {cameraStatus !== 'CLOSED' && (
            <Webcam
              audio={true}
              ref={webcamRef}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user'
              }}
              className="webcam-preview"
            />
          )}

          <div className="camera-controls">
            {cameraStatus === 'CLOSED' ? (
              <button className="btn-camera" onClick={handleOpenCamera}>
                Open Camera
              </button>
            ) : cameraStatus === 'OPEN' ? (
              <button className="btn-record" onClick={handleStartRecording}>
                Start Recording
              </button>
            ) : (
              <button className="btn-stop" onClick={handleStopRecording}>
                Stop Recording
              </button>
            )}
            
            {cameraStatus !== 'CLOSED' && (
              <button className="btn-camera" onClick={handleCloseCamera}>
                Close Camera
              </button>
            )}
          </div>

          {recording && (
            <div className="recording-actions">
              <button className="btn-download" onClick={handleDownloadRecording}>
                Download Recording
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Flashcards */}
      <div className="flashcards-column">
        <div className="column-header">
          <h2>Flashcards</h2>
          <button 
            className="btn-create" 
            onClick={() => setShowFlashcardModal(true)}
          >
            + New
          </button>
        </div>

        <div className="flashcards-list">
          {flashcards.length > 0 ? (
            flashcards.map(flashcard => (
              <div key={flashcard.id} className="flashcard-item">
                <div className="flashcard-content">
                  <p className="question">{flashcard.question}</p>
                  {flashcard.showAnswer && (
                    <div className="answer">
                      <p>{flashcard.answer}</p>
                    </div>
                  )}
                </div>
                <div className="flashcard-actions">
                  <button 
                    className="btn-toggle" 
                    onClick={() => handleToggleAnswer(flashcard.id)}
                  >
                    {flashcard.showAnswer ? 'Hide' : 'Show'}
                  </button>
                  <button 
                    className="btn-read" 
                    onClick={() => handleTextToSpeech(flashcard.question)}
                  >
                    🔊 Read
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleCardDelete(flashcard.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-flashcards">
              <p>No flashcards available</p>
            </div>
          )}
        </div>
      </div>

      {/* New Subdeck Modal */}
      <Modal
        isOpen={showDeckModal}
        onRequestClose={() => setShowDeckModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create Subdeck</h2>
            <button 
              className="modal-close" 
              onClick={() => setShowDeckModal(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleCreateSubdeck}>
            <div className="form-group">
              <label>Subdeck Name</label>
              <input
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowDeckModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={!newDeckName.trim()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* New Flashcard Modal */}
      <Modal
        isOpen={showFlashcardModal}
        onRequestClose={() => setShowFlashcardModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create Flashcard</h2>
            <button 
              className="modal-close" 
              onClick={() => setShowFlashcardModal(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleCreateNewFlashcard}>
            <div className="form-group">
              <label>Question</label>
              <textarea
                value={newFlashcard.question}
                onChange={(e) => setNewFlashcard({...newFlashcard, question: e.target.value})}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <textarea
                value={newFlashcard.answer}
                onChange={(e) => setNewFlashcard({...newFlashcard, answer: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowFlashcardModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={!newFlashcard.question.trim() || !newFlashcard.answer.trim()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default DeckList;