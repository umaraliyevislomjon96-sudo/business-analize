import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { ProgressProvider } from './context/ProgressContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ProgressProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ProgressProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
