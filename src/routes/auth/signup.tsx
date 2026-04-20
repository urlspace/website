import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
});

function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch("http://localhost:3000/v1/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      setError(`Signup failed: ${res.status}`);
      return;
    }

    setSuccess(true);
  }

  if (success)
    return <p>Account created! Check your email for a verification link.</p>;

  return (
    <main>
      <section>
        <h1>Sign up</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </section>
    </main>
  );
}
