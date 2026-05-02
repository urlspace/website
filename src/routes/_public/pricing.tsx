import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/pricing")({ component: App });

function App() {
  return <p>Pricing</p>;
}
