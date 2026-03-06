import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ContactForm from './components/ContactForm';

function App() {
  const handleForm = (data) => {
    console.log('submitted', data);
    // or set parent state, call API, etc.
  };

  return (
    <div className="app-bg">
      <h1>Taylor Swanson</h1>

      <div className="profile-avatar" role="img" aria-label="Taylor Swanson profile" />
      <div className="card">
        <p className="quote">
          "I'm legally blind"
        </p>
      </div>
      <p className="read-the-docs">
        Please share your contact information and join my constellation.
      </p>
      <ContactForm onSubmit={handleForm} />
    </div>
  )
}

export default App
