import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import AuthProvider from 'react-auth-kit/AuthProvider'
import createStore from 'react-auth-kit/createStore'

const store = createStore({
  authType: 'localstorage',
  authName: '_auth'
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider store={store}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
