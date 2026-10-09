import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { fromPublicUrl, hasSeparateDashboard, toPublicUrl } from "./utils.ts";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    context: { hasSession: false, queryClient },
    // Links to the other host become full page loads to that host, and
    // my.url.space/ shows the dashboard. Off locally, where both are one host.
    rewrite: hasSeparateDashboard
      ? {
          input: ({ url }) => fromPublicUrl(url),
          output: ({ url }) => toPublicUrl(url),
        }
      : undefined,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
