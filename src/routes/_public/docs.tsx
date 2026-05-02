import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/docs")({ component: App });

function App() {
  return <p>Docs</p>;
}
