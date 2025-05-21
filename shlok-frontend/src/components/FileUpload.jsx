import React, { useRef, useState } from 'react';

export default function FileUpload({ onUpload, currentEmotions }) {
  const fileInput = useRef();
  const [diff, setDiff] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    setError('');
    setDiff(null);
    setFileData(null);
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setFileData(json);
      // Simple diff: show added/removed/changed count
      const oldStr = JSON.stringify(currentEmotions);
      const newStr = JSON.stringify(json);
      if (oldStr === newStr) {
        setDiff('No changes detected.');
      } else {
        setDiff('File is different. Please review before confirming.');
      }
    } catch {
      setError('Malformed JSON file.');
    }
  };
  const handleConfirm = () => {
    if (fileData) onUpload(fileData);
  };

  return (
    <div style={{margin: '1rem 0'}}>
      <input type="file" accept="application/json" ref={fileInput} onChange={handleFile} />
      {error && <div style={{color:'red'}}>{error}</div>}
      {diff && <div style={{margin:'0.5rem 0'}}>{diff}</div>}
      {fileData && diff !== 'No changes detected.' && (
        <button onClick={handleConfirm}>Confirm Update</button>
      )}
    </div>
  );
}
