import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
  clear: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const res = await fetch("http://localhost:3000/v1/me", {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext value={{ user, loading, refetch: fetchUser, clear: () => setUser(null) }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
