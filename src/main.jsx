import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { clearLegacyStorage } from '@/lib/clearLegacyStorage'

clearLegacyStorage()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
