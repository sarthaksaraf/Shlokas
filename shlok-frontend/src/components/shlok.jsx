import React from 'react';

const shlokasData = {
  Happy: "Happiness is a state of mind. Share your joy with the world.",
  Loneliness: "You are a universe of energy. You are never truly alone.",
  Anxious: "Breathe in peace, exhale tension. This too shall pass.",
  Protection: "A shield of divine energy surrounds you, keeping you safe.",
  Peace: "In the stillness of the mind, you will find true peace.",
  Sad: "Tears are the rain that cleanses the soul for a brighter tomorrow.",
  Laziness: "Small steps of action overcome mountains of inertia.",
  Anger: "Let the fire within fuel positive change, not destruction."
};

export default function Shloks({ trigger, emotion, onClick }) {
  if (!trigger) return null;

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      width: '250px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', color: '#555' }}>
        {emotion}
      </h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '1.1em', fontStyle: 'italic', lineHeight: '1.4' }}>
        "{shlokasData[emotion] || "Believe in yourself."}"
      </p>
      <button 
        onClick={onClick} 
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          background: '#333',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.target.style.background = '#555'}
        onMouseOut={(e) => e.target.style.background = '#333'}
      >
        Close
      </button>
    </div>
  );
}
