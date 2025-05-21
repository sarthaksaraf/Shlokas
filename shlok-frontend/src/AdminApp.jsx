import React, { useEffect, useState } from 'react';
import EmotionGrid from './components/EmotionGrid';
import FileUpload from './components/FileUpload';
import VersionHistory from './components/VersionHistory';
import {
  fetchEmotionsGrouped,
  fetchVersions,
  fetchVersionFile,
  updateEmotions
} from './services/emotionsApi';

export default function AdminApp() {
  const [emotions, setEmotions] = useState({});
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [versionPreview, setVersionPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmotionsGrouped().then(setEmotions).catch(() => setError('API error'));
    fetchVersions().then(setVersions).catch(() => {});
  }, []);

  const handleUpload = async (data) => {
    setError(''); setSuccess('');
    const username = prompt('Enter admin username:');
    const password = prompt('Enter admin password:');
    try {
      await updateEmotions(data, username, password);
      setSuccess('Emotions updated!');
      fetchEmotionsGrouped().then(setEmotions);
      fetchVersions().then(setVersions);
    } catch (e) {
      setError(e?.response?.data?.error || 'Update failed');
    }
  };

  const handlePreview = async (filename) => {
    setSelectedVersion(filename);
    setVersionPreview(null);
    try {
      const data = await fetchVersionFile(filename);
      setVersionPreview(data);
    } catch {
      setVersionPreview('Error loading version');
    }
  };

  // Flatten grouped emotions for grid
  const allEmotions = Object.values(emotions).flat();

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'2rem'}}>
      <h2>Emotions Admin</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
      <FileUpload onUpload={handleUpload} currentEmotions={allEmotions} />
      <EmotionGrid emotions={allEmotions} />
      <VersionHistory versions={versions} onPreview={handlePreview} />
      {selectedVersion && (
        <div style={{margin:'1rem 0'}}>
          <h5>Preview: {selectedVersion}</h5>
          <pre style={{maxHeight:300,overflow:'auto',background:'#f4f4f4',padding:'1rem'}}>
            {JSON.stringify(versionPreview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
