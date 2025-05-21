import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx';

// To use admin interface, swap <App /> with <AdminApp /> below:
createRoot(document.getElementById('root')).render(
  <AdminApp />
)
