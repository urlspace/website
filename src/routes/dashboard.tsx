import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/v1/resources", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => setResources(json.data));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch("http://localhost:3000/v1/resources", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        url: form.get("url"),
      }),
    });

    if (!res.ok) {
      setError(`Failed: ${res.status}`);
      return;
    }

    const json = await res.json();
    setResources((prev) => [json.data, ...prev]);
    e.currentTarget.reset();
  }

  if (loading) return <p>Loading…</p>;
  if (!user) return <p>Not authenticated.</p>;

  return (
    <main>
      <section>
        <h1>Dashboard</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Pro: {user.isPro ? "Yes" : "No"}</p>
        <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      </section>

      <section>
        <h2>Add resource</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Description
            <input name="description" required />
          </label>
          <label>
            URL
            <input name="url" type="url" required />
          </label>
          <button type="submit">Add</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Resources</h2>
        {resources.length === 0 && <p>No resources yet.</p>}
        <ul>
          {resources.map((r) => (
            <li key={r.id}>
              <a href={r.url}>{r.title}</a> — {r.description}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
