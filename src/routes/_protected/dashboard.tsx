import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Link = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export const Route = createFileRoute("/_protected/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useLoaderData({ from: "/_protected" });
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/v1/links", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => setLinks((json as { data: Link[] }).data ?? []))
      .catch(() => setError("Failed"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch("http://localhost:3000/v1/links", {
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
      setError("Failed");
      return;
    }

    const json = await res.json();
    setLinks((json as { data: Link[] }).data ?? []);
    e.currentTarget.reset();
  }

  const router = useRouter();
  async function handleSignOut() {
    const res = await fetch("http://localhost:3000/v1/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      await router.invalidate();
      router.navigate({ to: "/auth/signin" });
    }
  }

  return (
    <main>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
      <section>
        <h1>User</h1>
        <p>Username: {user.username}</p>
        <p>Display name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Pro: {user.isPro ? "Yes" : "No"}</p>
        <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      </section>

      <section>
        <h2>Add link</h2>
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
        <h2>Links</h2>
        {links.length === 0 && <p>Empty</p>}
        <ul>
          {links.map((r) => (
            <li key={r.id}>
              <a href={r.url}>{r.title}</a> — {r.description}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
