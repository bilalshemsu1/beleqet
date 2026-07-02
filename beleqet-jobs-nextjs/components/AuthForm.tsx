"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const modeCopy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to manage your jobs, bids, and account.",
    button: "Sign In",
    alternateText: "Need an account?",
    alternateLink: "/register",
    alternateLabel: "Create one",
    helperLink: "/auth/forgot-password",
    helperLabel: "Forgot password?",
  },
  register: {
    title: "Create your account",
    subtitle: "Join Beleqet to post jobs or apply for opportunities.",
    button: "Create Account",
    alternateText: "Already have an account?",
    alternateLink: "/login",
    alternateLabel: "Sign in",
  },
} as const;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { status, signIn, signUp } = useAuth();
  const copy = modeCopy[mode];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"JOB_SEEKER" | "EMPLOYER">("JOB_SEEKER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/jobs");
    }
  }, [router, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await signIn({ email, password });
      } else {
        await signUp({ firstName, lastName, email, password, role });
      }

      router.replace("/jobs");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-14 max-w-2xl">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-cardHover">
        <div className="max-w-md">
          <h1 className="text-pageH1">{copy.title}</h1>
          <p className="text-muted mt-3">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "register" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink">First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink">Last Name</label>
                <input
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
                />
              </div>
            </div>
          )}

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

          <div>
            <label className="text-xs font-semibold text-ink">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold text-ink">Account Type</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as "JOB_SEEKER" | "EMPLOYER")}
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen bg-white"
              >
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </div>
          )}

          {error && <p className="text-sm text-redAccent font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brandGreen text-white text-sm font-semibold py-3 hover:bg-darkGreen transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : copy.button}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          {copy.alternateText} <Link href={copy.alternateLink} className="font-semibold text-brandGreen hover:underline">{copy.alternateLabel}</Link>
        </p>

        {mode === "login" && (
          <p className="mt-2 text-sm text-muted">
            <Link href={modeCopy.login.helperLink} className="font-semibold text-brandGreen hover:underline">
              {modeCopy.login.helperLabel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
