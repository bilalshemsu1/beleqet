export const AUTH_API_BASE_URL = "/api";

export const AUTH_STORAGE_KEY = "beleqet.auth";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
  role?: "JOB_SEEKER" | "EMPLOYER" | "FREELANCER";
};

export type CurrentUser = {
  userId: string;
  email: string;
  role: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function request<T>(path: string, options: RequestInit = {}) {
  return fetch(`${AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  }).then(async (response) => {
    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const error = (await response.json()) as { message?: string | string[] };
        if (Array.isArray(error.message)) {
          message = error.message.join(", ");
        } else if (typeof error.message === "string") {
          message = error.message;
        }
      } catch {
        // fall back to the generic message
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  });
}

export async function login(payload: LoginPayload) {
  return request<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return request<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refresh(refreshToken: string) {
  return request<AuthSession>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getCurrentUser(accessToken: string) {
  return request<CurrentUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function logout(accessToken: string) {
  return request<void>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function verifyEmail(token: string) {
  return request<{ success: boolean; message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function forgotPassword(email: string) {
  return request<{ success: boolean; message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request<{ success: boolean; message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export function loadAuthSession() {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
