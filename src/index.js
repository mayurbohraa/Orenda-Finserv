/** App entry point */
import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  createElement(
    StrictMode,
    null,
    createElement(
      BrowserRouter,
      null,
      createElement(AppProvider, null, createElement(App)),
    ),
  ),
)
