import {
  createFileRoute,
  Link,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

type LinkRow = {
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
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/links`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => setLinks((json as { data: LinkRow[] }).data ?? []))
      .catch(() => setError("Failed"));
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formElm = e.currentTarget;
    const form = new FormData(formElm);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
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
    setLinks([(json as { data: LinkRow }).data, ...links]);
    formElm.reset();
  }

  const router = useRouter();
  async function handleSignOut() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    // TODO: bug, what if the authentication fails on the sighout click,
    // user should still be moved away from the dashboard, anc cookie should be cleard
    // somethign similar that we do on the _protected file with clearing cookies,
    //  maybe this should run on server, i dont know

    if (res.ok) {
      await router.invalidate();
      await router.navigate({ to: "/auth/signin" });
    }
  }

  return (
    <div>
      <Link to="/">🥑 Go home bro</Link>
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
    </div>
  );
}
