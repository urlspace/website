import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/docs")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Documentation | url.space",
      },
    ],
  }),
});

function App() {
  return <p>Documentation</p>;
}
