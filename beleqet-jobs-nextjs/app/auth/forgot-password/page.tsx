"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-14 max-w-xl">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-cardHover">
        <h1 className="text-pageH1">Forgot Password</h1>
        <p className="text-muted mt-3">Enter your email and we&apos;ll send a reset link if the account exists.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            />
          </div>

          {message && <p className="text-sm text-brandGreen font-medium">{message}</p>}
          {error && <p className="text-sm text-redAccent font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brandGreen text-white text-sm font-semibold py-3 hover:bg-darkGreen transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Remembered it? <Link href="/login" className="font-semibold text-brandGreen hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
