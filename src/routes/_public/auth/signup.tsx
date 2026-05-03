import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_public/auth/signup")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: SignUp,
});

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
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
        setError("signup failed");
        return;
      }

      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>"Submitting"</p>;
  if (success) return <p>"Success"</p>;

  return (
    <main>
      <section>
        <h1>"Signup"</h1>
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
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  );
}
