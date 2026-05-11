import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/terms-of-service")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Terms of service | url.space",
      },
    ],
  }),
});

function App() {
  return <p>Terms of service</p>;
}
