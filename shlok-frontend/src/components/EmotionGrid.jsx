import React, { useState, useEffect } from 'react';
import './EmotionGrid.css';
import { fetchEmotionsGrouped, fetchRandomEmotion } from '../services/emotionsApi';

export default function EmotionGrid() {
  const [grouped, setGrouped] = useState({});
  const [expanded, setExpanded] = useState(null); // emotion name
  const [emotionData, setEmotionData] = useState({}); // { [emotion]: last fetched object }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmotionsGrouped()
      .then(setGrouped)
      .catch(() => setError('Failed to load emotions'));
  }, []);

  const handleTileClick = async (emotion) => {
    setExpanded(emotion);
    setLoading(true);
    setError('');
    try {
      const data = await fetchRandomEmotion(emotion);
      setEmotionData((prev) => ({ ...prev, [emotion]: data }));
    } catch {
      setError('Failed to fetch emotion data');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (emotion) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRandomEmotion(emotion);
      setEmotionData((prev) => ({ ...prev, [emotion]: data }));
    } catch {
      setError('Failed to fetch emotion data');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setExpanded(null);
  };

  const emotionTypes = Object.keys(grouped);

  return (
    <div className="emotion-grid">
      {error && <div style={{color:'red'}}>{error}</div>}
      {emotionTypes.map((emotion) => {
        const isOpen = expanded === emotion;
        const showData = emotionData[emotion];
        const arr = grouped[emotion];
        const showIdx = 0;
        return (
          <div
            key={emotion}
            className={`emotion-tile${isOpen ? ' expanded' : ''}`}
            onClick={() => !isOpen && handleTileClick(emotion)}
            style={{ cursor: isOpen ? 'default' : 'pointer', zIndex: isOpen ? 10 : 1 }}
          >
            <h3>{emotion}</h3>
            {!isOpen && arr?.[showIdx]?.quote && <blockquote>{arr[showIdx].quote}</blockquote>}
            {isOpen && (
              <div className="emotion-content">
                <button className="close-btn" onClick={handleClose} title="Close">&times;</button>
                {loading ? (
                  <div style={{margin:'2rem',textAlign:'center'}}>Loading...</div>
                ) : showData && !showData.error ? (
                  <>
                    <blockquote>{showData.quote}</blockquote>
                    <p><b>Output:</b> {showData.output}</p>
                    <p><b>Realization Prompt:</b> {showData.realization_prompt}</p>
                    <p><b>Playful Task:</b> {showData.playful_task}</p>
                    <button style={{marginTop:'1rem'}} onClick={() => handleNext(emotion)}>Next</button>
                  </>
                ) : (
                  <div style={{color:'red'}}>Failed to fetch data</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
