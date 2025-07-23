// LeadForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      await axios.post('https://austins.app.n8n.cloud/webhook/lead-capture', formData);
      setStatus('Success! We’ll be in touch.');
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <h3>Get in Touch</h3>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
      /><br />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br />
      <button type="submit">Submit</button>
      <p>{status}</p>
    </form>
  );
};

export default LeadForm;
