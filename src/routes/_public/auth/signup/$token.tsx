import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button, Heading, Page, Stack } from "#/components";

export const Route = createFileRoute("/_public/auth/signup/$token")({
  beforeLoad: ({ context }) => {
    if (context.hasSession)
      throw redirect({
        to: "/dashboard",
      });
  },
  component: Verify,
  head: () => ({
    meta: [
      {
        title: "Activate account | url.space",
      },
    ],
  }),
});

function Verify() {
  const router = useRouter();
  const { token } = Route.useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  async function handleActivate() {
    if (isLoading) return;

    setErrorStatus(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        await router.navigate({ to: "/auth/signin" });
        return;
      }

      setErrorStatus(res.status);
    } catch {
      setErrorStatus(500);
    } finally {
      setIsLoading(false);
    }
  }

  if (errorStatus !== null) {
    let message: React.ReactNode;
    switch (errorStatus) {
      case 400:
        message = <p>This verification link is invalid.</p>;
        break;
      case 401:
        message = (
          <p>
            This verification link has expired. Please{" "}
            <Link to="/auth/resend-verification">
              request a new verification link
            </Link>
            .
          </p>
        );
        break;
      case 429:
        message = <p>Too many attempts. Please wait a moment and try again.</p>;
        break;
      default:
        message = (
          <p>
            Something went wrong on our end. Please try again in a few minutes,
            or email me at <a href="mailto:mail@url.space">mail@url.space</a> if
            the problem persists.
          </p>
        );
    }

    return (
      <Page narrow>
        <Stack gap={2}>
          <Heading level={1} text="Verification of your account failed" />
          {message}
        </Stack>
      </Page>
    );
  }

  return (
    <Page narrow>
      <Stack gap={2}>
        <Heading level={1} text="Welcome to url.space" />
        <p>Tap the button below to activate your account and sign in.</p>
        <Button
          type="button"
          text={
            isLoading ? "Activating..." : "Activate account and go to sign in"
          }
          ariaDisabled={isLoading}
          onClick={handleActivate}
        />
      </Stack>
    </Page>
  );
}
