import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Form, Heading, Page, Stack } from "#/components";

export const Route = createFileRoute("/_public/auth/resend-verification")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: ResendVerification,
  head: () => ({
    meta: [
      {
        title: "Resend verification | url.space",
      },
    ],
  }),
});

function ResendVerification() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
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
        form.focus();
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Try again in a moment.");
      form.focus();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page narrow>
      <Stack gap={2}>
        <Heading level={1} text="Resend verification" />
        {done ? (
          <p role="status">
            Sent! Check your inbox and confirm your email address within the
            next 24 hours.
          </p>
        ) : (
          <Form onSubmit={handleSubmit} isLoading={isLoading}>
            <Form.Error errorMessage={error} />
            <Form.Input
              autoComplete="email"
              disabled={isLoading}
              label="Email"
              maxLength={254}
              name="email"
              onChange={setEmail}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              placeholder="sylvester@stallone.com"
              required
              type="email"
              value={email}
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
