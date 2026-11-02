"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
};

export default function ConfirmSubscriptionForm({
  token,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/confirm-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        router.replace("/blog?subscription=confirmed");
        return;
      }

      if (response.status === 400) {
        router.replace("/blog?subscription=invalid");
        return;
      }

      setError(
        "Something went wrong. Please try again."
      );
    } catch {
      setError(
        "Unable to connect. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="rounded-md bg-[#333333] px-6 py-3 text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Confirming..."
          : "Confirm my subscription 🚀"}
      </button>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
