import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_public/auth/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
  component: Verify,
});

function Verify() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    fetch("http://localhost:3000/v1/auth/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") return <p>Verifying</p>;
  if (status === "error")
    return (
      <p>
        Failed
        <Link to="/auth/resend-verification">"Resend verification email"</Link>
      </p>
    );
  return <p>"Success"</p>;
}
