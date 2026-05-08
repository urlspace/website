import { Button, Form, Heading, Page, Stack } from "#/components";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_public/auth/signup/")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: SignUp,
});

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/v1/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("Please check your input and try again.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      setSuccess(true);
    } catch (e) {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Stack gap={2}>
        <Heading level={1} text="Sign up" />
        {success ? (
          <p>
            Check your inbox and confirm your email address within the next 24
            hours.
          </p>
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <Form.Error errorMessage={error} />
              <Form.Input
                autoComplete="nickname"
                label="Username"
                name="username"
                value={username}
                onChange={setUsername}
                type="text"
                placeholder="rocky"
                required
              />
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
              <Form.Input
                autoComplete="new-password"
                description="Use a strong password that is a minimum of 12 characters long. Please do not include parts of your email address or username in your password."
                label="Password"
                name="password"
                value={password}
                onChange={setPassword}
                type="password"
                placeholder="Min 12 characters"
                required
                minLength={12}
                maxLength={128}
              />
              <Button
                type="submit"
                text={isLoading ? "Signing up..." : "Sign up"}
                disabled={isLoading}
              />
            </Form>

            <p>
              Already have an account? <Link to="/auth/signin">Sign in</Link>.
              If you have any troubles with creating an account, email me at{" "}
              <a href="mailto:mail@url.space">mail@url.space</a>.
            </p>
            <p>
              By signing up, you agree to our{" "}
              <Link to="/terms-of-service">Terms of Service</Link> and{" "}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </>
        )}
      </Stack>
    </Page>
  );
}
