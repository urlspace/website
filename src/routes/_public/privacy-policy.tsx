import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy-policy")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Privacy policy | url.space",
      },
    ],
  }),
});

function App() {
  return <p>Privacy policy</p>;
}
