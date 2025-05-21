import React from 'react';

export default function VersionHistory({ versions, onPreview }) {
  return (
    <div style={{margin:'2rem 0'}}>
      <h4>Version History</h4>
      <ul style={{listStyle:'none',padding:0}}>
        {versions.map((v) => (
          <li key={v} style={{marginBottom:'0.5rem'}}>
            <button onClick={() => onPreview(v)}>{v}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
