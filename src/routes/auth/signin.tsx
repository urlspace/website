import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../components/AuthContext";

export const Route = createFileRoute("/auth/signin")({
  component: SignIn,
});

function SignIn() {
  const { refetch } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch("http://localhost:3000/v1/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      setError(`Sign in failed: ${res.status}`);
      return;
    }

    await refetch();
    navigate({ to: "/dashboard" });
  }

  return (
    <main>
      <section>
        <h1>Sign in</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
