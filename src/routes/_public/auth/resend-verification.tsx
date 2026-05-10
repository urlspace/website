import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Heading, Form, Button, Stack, Page } from "#/components";

export const Route = createFileRoute("/_public/auth/resend-verification")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: ResendVerification,
});

function ResendVerification() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/v1/auth/resend-verification",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        },
      );

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("Invalid email.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Stack gap={2}>
        <Heading level={1} text="Resend verification" />
        {sent ? (
          <p>
            Sent! Check your inbox and confirm your email address within the
            next 24 hours.
          </p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Error errorMessage={error} />
            <Form.Input
              autoComplete="username"
              label="Email"
              name="email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="sylvester@stallone.com"
              required
              maxLength={254}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            />
            <Button
              type="submit"
              text={isLoading ? "Sending..." : "Send verification link"}
              disabled={isLoading}
            />
          </Form>
        )}
      </Stack>
    </Page>
  );
}
