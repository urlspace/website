import { useState } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import appCss from "../styles.css?url";

const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await env.EMAILS.put(data.email, new Date().toISOString());
    return { success: true };
  });

export const Route = createRootRoute({
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "url.space",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "32x32",
      },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
    ],
  }),
});

function EmailForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  return status === "success" ? (
    <p className="form__message">Thanks for signing up!</p>
  ) : (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        try {
          await subscribeEmail({ data: { email } });
          form.reset();
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
    >
      <label htmlFor="join" className="label">
        Email address
      </label>
      <input
        type="email"
        id="join"
        name="email"
        className="input"
        required
        placeholder="jackie@chan.com"
      />
      <button>Join the waitlist</button>
      {status === "error" && (
        <p className="form__error">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found</p>
    </main>
  );
}

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <div className="app">
          <div className="app__cell"></div>
          <div className="app__cell"></div>
          <div className="app__cell"></div>
          <div className="app__cell"></div>
          <div className="app__cell">
            <div className="app__content">
              <h1>url.space</h1>
              <p>
                Keep, organise and share websites you like. Open source, no ads,
                no tracking, no AI, just a space for your URLs. Free for
                everyday use with power user features for a tiny fee.
              </p>
              <EmailForm />
            </div>
          </div>
          <div className="app__cell"></div>
          <div className="app__cell"></div>
          <div className="app__cell"></div>
          <div className="app__cell"></div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
