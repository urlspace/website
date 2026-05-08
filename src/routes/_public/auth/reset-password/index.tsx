import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Heading, Form, Button, Stack, Page } from "#/components";

export const Route = createFileRoute("/_public/auth/reset-password/")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: ResetPassword,
});

function ResetPassword() {
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
        "http://localhost:3000/v1/auth/reset-password-request",
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
    } catch (e) {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Stack gap={2}>
        <Heading level={1} text="Request password reset" />
        {sent ? (
          <p>
            Sent! Check your inbox and click the link within the next hour to
            set a new password.
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
            />
            <Button
              type="submit"
              text={isLoading ? "Sending..." : "Send reset link"}
              disabled={isLoading}
            />
          </Form>
        )}
      </Stack>
    </Page>
  );
}
