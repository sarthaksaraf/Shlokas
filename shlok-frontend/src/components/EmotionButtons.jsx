import React from "react";
import "./EmotionButtons.css"; // We'll style it separately

const emotions = [
  "Happy",
  "Loneliness",
  "Anxious",
  "Protection",
  "Peace",
  "Sad",
  "Laziness",
  "Anger",
];

const colors = [
  "#f1c40f", // Happy - Yellow
  "#8e44ad", // Loneliness - Purple
  "#3498db", // Anxious - Blue
  "#1abc9c", // Protection - Teal
  "#2ecc71", // Peace - Green
  "#34495e", // Sad - Dark Blue
  "#95a5a6", // Laziness - Gray
  "#8B0000", // Anger - Dark Red
];

export default function EmotionButtons({ onSelect }) {
  return (
    <div className="emotion-buttons">
      {emotions.map((emotion, index) => (
        <button
          key={emotion}
          className="emotion-button"
          style={{ backgroundColor: colors[index] }}
          onClick={() => onSelect(emotion)}
        >
          {emotion}
        </button>
      ))}
    </div>
  );
}
