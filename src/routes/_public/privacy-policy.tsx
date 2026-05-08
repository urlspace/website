import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy-policy")({
  component: App,
});

function App() {
  return <p>Privacy policy</p>;
}
