'use client';

import { useState, type FormEvent } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setMessage(data.message);
      setEmail('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Stay Updated with Chai Coffee Lit ☕️</h2>

      <p>
        Get notified whenever we publish a new blog post!
      </p>

      <div className="mt-2 flex items-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border border-[#333333]/30 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-[#333333] rounded-md w-64"
        />

        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-[#333333] px-2 py-2 text-sm text-white hover:bg-[#555555] disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </div>

      {message && <p role="status">{message}</p>}
    </form>
  );
}
