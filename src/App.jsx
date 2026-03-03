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
    <>
      <div>
        {/* <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Taylor Swanson</h1>
      <div className="card">
        <p className="quote">
          "I'm legally blind"
        </p>
      </div>
      <p className="read-the-docs">
        Please share your contact information and join my constellation.
      </p>
      <ContactForm onSubmit={handleForm} />
    </>
  )
}

export default App
