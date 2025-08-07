import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { disableAPI } from './utils/apiToggle'

disableAPI();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
