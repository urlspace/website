import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({ component: App });

function App() {
  return (
    <main>
      <h1>url.space</h1>
      <p>
        Keep, organise and share websites you like. Open source, no ads, no
        tracking, no AI, just a space for your URLs. Free for everyday use with
        power user features for a tiny fee.
      </p>
      <Link to="/auth/signup">Sign up</Link>
    </main>
  );
}
