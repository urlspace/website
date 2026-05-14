import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Form, Heading, Page, Stack } from "#/components";

export const Route = createFileRoute("/_public/auth/reset-password/$token")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: ResetPasswordConfirm,
  head: () => ({
    meta: [
      {
        title: "Reset password | url.space",
      },
    ],
  }),
});

function ResetPasswordConfirm() {
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);
  const { token } = Route.useParams();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      form.focus();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password-confirm`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("That password doesn't meet our requirements.");
            break;
          case 401:
          case 404:
            setError(
              <>
                This reset link is invalid or has expired. Please{" "}
                <Link to="/auth/reset-password">request a new one</Link>.
              </>,
            );
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
        <Heading level={1} text="Reset password" />
        {done ? (
          <p role="status">
            Your password has been reset and you've been signed out of all other
            devices. You can now <Link to="/auth/signin">sign in</Link> with
            your new password.
          </p>
        ) : (
          <Form onSubmit={handleSubmit} isLoading={isLoading}>
            <Form.Error errorMessage={error} />
            <Form.Input
              autoComplete="new-password"
              description="Use a strong password that is a minimum of 12 characters long. Please do not include parts of your email address or username in your password."
              disabled={isLoading}
              label="New password"
              maxLength={128}
              minLength={12}
              name="password"
              onChange={setPassword}
              placeholder="Min 12 characters"
              required
              type="password"
              value={password}
            />
            <Form.Input
              autoComplete="new-password"
              disabled={isLoading}
              label="Repeat new password"
              maxLength={128}
              minLength={12}
              name="passwordConfirm"
              onChange={setPasswordConfirm}
              placeholder="Min 12 characters"
              required
              type="password"
              value={passwordConfirm}
            />
            <Button
              disabled={isLoading}
              text={isLoading ? "Resetting..." : "Reset password"}
              type="submit"
            />
          </Form>
        )}
      </Stack>
    </Page>
  );
}
