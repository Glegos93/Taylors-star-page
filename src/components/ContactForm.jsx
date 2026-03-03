import { useState } from 'react';

export default function ContactForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [chapter, setChapter] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, chapter, email };
    if (typeof onSubmit === 'function') onSubmit(payload);
    setName('');
    setChapter('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </label>
      <label>
        Chapter:
        <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Chapter" />
      </label>
      <label>
        Email:
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}