import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import api, { TOKEN_KEY } from "@/lib/api";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the stored token has been checked against the backend. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Fall back to the email prefix for accounts created before names were stored. */
function displayName(profile: { name?: string | null; email: string }): string {
  if (profile.name) return profile.name;
  return profile.email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  /** Exchange whatever token we hold for the current user, or drop it. */
  const loadUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser({ id: data.id, email: data.email, name: displayName(data) });
    } catch {
      clearSession();
    }
  }, [clearSession]);

  // Restore the session on first load. A token in localStorage is only a
  // claim - it is worth nothing until /auth/me verifies it server-side.
  useEffect(() => {
    loadUser().finally(() => setIsLoading(false));
  }, [loadUser]);

  // The axios response interceptor fires this when any request returns 401.
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("ymn:unauthorized", onUnauthorized);
    return () => window.removeEventListener("ymn:unauthorized", onUnauthorized);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // /auth/login expects OAuth2 form fields, not JSON - the email goes in
    // the field named "username".
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);

    const { data } = await api.post("/auth/login", form);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    await loadUser();
  }, [loadUser]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(() => clearSession(), [clearSession]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, signIn, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
