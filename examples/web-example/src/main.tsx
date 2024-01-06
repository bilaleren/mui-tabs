import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
import 'mui-tabs/styles/all.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="container">
      <App />
    </div>
  </React.StrictMode>
)
