import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/terms-of-service")({
  component: App,
});

function App() {
  return <p>Terms of service</p>;
}
