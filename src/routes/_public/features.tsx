import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/features")({
  component: App,
});

function App() {
  return <p>Features</p>;
}
