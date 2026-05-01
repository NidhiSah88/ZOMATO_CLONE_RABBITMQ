import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';



export const authService = "http://localhost:5001";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
{/* GOOGLE_CLIENT_ID: 1007813798364-o9a3o4qkvcbgqnqg5j8v3f4b5mfmblv7.apps.googleusercontent.com */}
    <GoogleOAuthProvider clientId="1007813798364-o9a3o4qkvcbgqnqg5j8v3f4b5mfmblv7.apps.googleusercontent.com">
      <App />  
    </GoogleOAuthProvider>;

  
  </StrictMode>,
)
