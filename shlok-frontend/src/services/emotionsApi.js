import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper to prepend base URL and handle relative paths
const api = axios.create({
  baseURL: API_BASE + '/api/emotions',
  withCredentials: true,
});

// Fetch all emotions grouped by type
export const fetchEmotionsGrouped = async () => {
  const res = await api.get('/');
  return res.data; // { Joy: [...], Love: [...], ... }
};

// Fetch a random emotion object for a given type
export const fetchRandomEmotion = async (emotion) => {
  const res = await api.get(`/random/${encodeURIComponent(emotion)}`);
  return res.data;
};

export const fetchVersions = async () => {
  const res = await api.get('/versions');
  return res.data;
};

export const fetchVersionFile = async (filename) => {
  const res = await api.get(`/version/${filename}`);
  return res.data;
};

export const updateEmotions = async (data, username, password) => {
  const auth = 'Basic ' + btoa(`${username}:${password}`);
  const res = await api.post(
    '/update',
    data,
    {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};
