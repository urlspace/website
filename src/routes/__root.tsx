import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import appCss from "../styles.css?url";

const checkSession = createServerFn().handler(() => ({
  hasSession: getCookie("session") !== undefined,
}));

export const Route = createRootRouteWithContext<{
  hasSession: boolean;
  queryClient: QueryClient;
}>()({
  beforeLoad: () => checkSession(),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: GenericError,
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
        name: "author",
        content: "Pawel Grzybek - https://pawelgrzybek.com/",
      },
      {
        name: "color-scheme",
        content: "light dark",
      },
      {
        property: "og:title",
        content: "url.space | Keep, organise and share websites you like.",
      },
      {
        property: "og:url",
        content: "https://url.space",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:description",
        content:
          "Keep, organise and share websites you like. Open source, no ads, no tracking, no AI, just a space for your URLs. Free for everyday use with power user features for a tiny fee.",
      },
      {
        property: "og:image",
        content: "/og.jpg",
      },
      {
        title: "url.space | Keep, organise and share websites you like.",
      },
      {
        name: "description",
        content:
          "Keep, organise and share websites you like. Open source, no ads, no tracking, no AI, just a space for your URLs. Free for everyday use with power user features for a tiny fee.",
      },
      {
        name: "fediverse:creator",
        content: "@urlspace@mastodon.social",
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

function NotFound() {
  return (
    <main>
      <h1>Not found</h1>
    </main>
  );
}

function GenericError() {
  return (
    <main>
      <h1>Generic error</h1>
    </main>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
