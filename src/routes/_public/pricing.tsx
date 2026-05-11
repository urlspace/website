import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/pricing")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Pricing | url.space",
      },
    ],
  }),
});

function App() {
  return <p>Pricing</p>;
}
