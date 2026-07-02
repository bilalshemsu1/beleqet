"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  clearAuthSession,
  getCurrentUser,
  loadAuthSession,
  login,
  logout,
  refresh,
  register,
  saveAuthSession,
  type AuthSession,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/auth";

type AuthStatus = "loading" | "anonymous" | "authenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  signIn: (payload: LoginPayload) => Promise<AuthSession>;
  signUp: (payload: RegisterPayload) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function bootstrapSession(session: AuthSession | null) {
  if (!session) {
    return null;
  }

  try {
    await getCurrentUser(session.accessToken);
    return session;
  } catch {
    try {
      const nextSession = await refresh(session.refreshToken);
      saveAuthSession(nextSession);
      return nextSession;
    } catch {
      clearAuthSession();
      return null;
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    void (async () => {
      const storedSession = await bootstrapSession(loadAuthSession());
      setSession(storedSession);
      setStatus(storedSession ? "authenticated" : "anonymous");
    })();
  }, []);

  async function updateSession(nextSession: AuthSession) {
    saveAuthSession(nextSession);
    setSession(nextSession);
    setStatus("authenticated");
    return nextSession;
  }

  async function signIn(payload: LoginPayload) {
    return updateSession(await login(payload));
  }

  async function signUp(payload: RegisterPayload) {
    return updateSession(await register(payload));
  }

  async function signOut() {
    if (session) {
      try {
        await logout(session.accessToken);
      } catch {
        // Ignore logout errors and clear local state anyway.
      }
    }

    clearAuthSession();
    setSession(null);
    setStatus("anonymous");
  }

  async function refreshSession() {
    if (!session) {
      return null;
    }

    try {
      const nextSession = await refresh(session.refreshToken);
      saveAuthSession(nextSession);
      setSession(nextSession);
      setStatus("authenticated");
      return nextSession;
    } catch {
      clearAuthSession();
      setSession(null);
      setStatus("anonymous");
      return null;
    }
  }

  const value: AuthContextValue = {
    status,
    user: session?.user ?? null,
    session,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
