import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Heading, Form, Button, Stack, Page } from "#/components";

export const Route = createFileRoute("/_public/auth/reset-password/$token")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: ResetPasswordConfirm,
});

function ResetPasswordConfirm() {
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = Route.useParams();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/v1/auth/reset-password-confirm",
        {
          method: "POST",
          credentials: "include",
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
              "This reset link is invalid or has expired. Please request a new one.",
            );
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      setDone(true);
    } catch (e) {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Stack gap={2}>
        <Heading level={1} text="Reset password" />
        {done ? (
          <p>
            Your password has been reset and you've been signed out of all other
            devices. You can now <Link to="/auth/signin">sign in</Link> with
            your new password.
          </p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Error errorMessage={error} />
            <Form.Input
              autoComplete="new-password"
              // TODO: implement dynamic message
              description="Here is the generated password descriptino that we are going to implementa as part of the fututre work on the signup form refactor. For now this is only a todo item."
              label="New password"
              name="password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Min 12 characters"
              required
              minLength={12}
              maxLength={128}
            />
            <Form.Input
              autoComplete="new-password"
              label="Repeat new password"
              name="password-two"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              type="password"
              placeholder="Min 12 characters"
              required
              minLength={12}
              maxLength={128}
            />
            <Button
              type="submit"
              text={isLoading ? "Resetting..." : "Reset password"}
              disabled={isLoading}
            />
          </Form>
        )}
      </Stack>
    </Page>
  );
}
