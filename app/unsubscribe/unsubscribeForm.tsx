"use client";

import { useState } from "react";

export default function UnsubscribeForm({
  token,
}: {
  token: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleUnsubscribe() {
    if (loading || success) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        setError(
          response.status === 400
            ? "This unsubscribe link is invalid."
            : "Something went wrong. Please try again."
        );
        return;
      }

      setSuccess(true);

      // Remove the token from browser history.
      window.history.replaceState(
        null,
        "",
        "/unsubscribe"
      );
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div role="status" className="border border-[#333333]/20 p-5">
        <h2 className="mb-2 text-xl">
          You've been unsubscribed.
        </h2>
        <p>
          You will no longer receive new blog
          notifications from Chai Coffee Lit.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={loading}
        className="rounded-md bg-[#333333] px-6 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Unsubscribing..." : "Unsubscribe"}
      </button>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
