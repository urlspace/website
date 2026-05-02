import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/blog")({ component: App });

function App() {
  return <p>Blog</p>;
}
