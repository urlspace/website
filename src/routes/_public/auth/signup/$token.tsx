import { Page, Stack, Heading } from "#/components";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const verify = createServerFn({ method: "POST" })
  .inputValidator((token: string) => token)
  .handler(async ({ data: token }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      return { status: res.status };
    } catch {
      return { status: 500 };
    }
  });

export const Route = createFileRoute("/_public/auth/signup/$token")({
  loader: ({ params }) => verify({ data: params.token }),
  component: Verify,
});

function Verify() {
  const { status } = Route.useLoaderData();

  if (status === 200) {
    return (
      <Page>
        <Stack gap={2}>
          <Heading level={1} text="Your account has been verified" />
          <p>
            Your account is now active. Go to{" "}
            <Link to="/auth/signin">sign in page</Link>.
          </p>
        </Stack>
      </Page>
    );
  }

  let message: React.ReactNode;
  switch (status) {
    case 400:
      message = (
        <p>
          This verification link is invalid. Please check that you copied the
          full link from your email and try again.
        </p>
      );
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
          Something went wrong on our end. Please try again in a few minutes, or
          email me at <a href="mailto:mail@url.space">mail@url.space</a> if the
          problem persists.
        </p>
      );
  }

  return (
    <Page>
      <Stack gap={2}>
        <Heading level={1} text="Verification of your account failed" />
        {message}
      </Stack>
    </Page>
  );
}
