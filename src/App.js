

import React, { useState, useEffect } from 'react';
import './App.css';
import { analyzeMood } from './api';

function App() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  
  useEffect(() => {
    const saved = localStorage.getItem('moodHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);


  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(history));
  }, [history]);

  const handleChange = (e) => {
    setEntry(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (entry.trim() === '') return;

    setLoading(true);
    setMood(null);

    try {
      const result = await analyzeMood(entry);
      console.log("API Result:", result);

      const predictions = Array.isArray(result[0]) ? result[0] : result;
      const label = predictions[0]?.label || 'Unknown';
      setMood(label);

    
      setHistory(prev => [...prev, { text: entry, mood: label }]);
    } catch (error) {
      console.error('Error analyzing mood:', error);
      alert(error.message);
      setMood('Error');
    }

    setLoading(false);
    setEntry('');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('moodHistory'); // Optional: clear from storage too
  };

  return (
    <div className="App">
      <h1>Mood Journal</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          placeholder="How are you feeling today?"
          value={entry}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Analyze Mood</button>
      </form>

      {loading && <p>Analyzing your mood...</p>}

      {mood && (
        <p>
          {mood === 'POSITIVE' && (
            <span className="positive">Your mood seems <strong>positive</strong> 😊 Keep it up!</span>
          )}
          {mood === 'NEGATIVE' && (
            <span className="negative">Your mood seems <strong>negative</strong> 😔 Be kind to yourself today.</span>
          )}
          {mood !== 'POSITIVE' && mood !== 'NEGATIVE' && (
            <span>Your mood seems: <strong>{mood}</strong></span>
          )}
        </p>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Past Entries</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <strong>{item.mood}</strong>: {item.text}
              </li>
            ))}
          </ul>
          <button onClick={handleClearHistory}>Clear History</button>
        </div>
      )}
    </div>
  );
}

export default App;
