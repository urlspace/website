import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/resend-verification")({
  component: ResendVerification,
});

function ResendVerification() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch(
      "http://localhost:3000/v1/auth/resend-verification",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      },
    );

    if (!res.ok) {
      setError(`Failed: ${res.status}`);
      return;
    }

    setSuccess(true);
  }

  if (success) return <p>Verification email sent!</p>;

  return (
    <main>
      <section>
        <h1>Resend verification email</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <button type="submit">Resend</button>
        </form>
      </section>
    </main>
  );
}
