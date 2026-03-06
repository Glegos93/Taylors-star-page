import { useState } from 'react'
import './App.css'
import ContactForm from './components/ContactForm';
import Stars from './components/Stars';

function App() {
  const [status, setStatus] = useState(null);

  const handleForm = async (data) => {
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:4000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus('saved');
    } catch (err) {
      console.error('Failed to send submission to server', err);
      setStatus('error');
    }
    setTimeout(() => setStatus(null), 3000);
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
      <Stars />
      {status === 'sending' && <p>Sending…</p>}
      {status === 'saved' && <p>Thanks — your info was saved.</p>}
      {status === 'error' && <p>Could not save submission (see console).</p>}
    </div>
  )
}

export default App
