import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/features")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Features | url.space",
      },
    ],
  }),
});

function App() {
  return <p>Features</p>;
}
