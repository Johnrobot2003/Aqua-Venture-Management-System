import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Centralize axios configuration
axios.defaults.baseURL = 'https://aqua-venture-backend.onrender.com'
axios.defaults.withCredentials = true
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
