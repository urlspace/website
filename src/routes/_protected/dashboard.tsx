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
    <div className="dashboard">
      <aside className="dashbaord__sidebar">
        <div className="dashboard__section">
          <Link to="/" className="dashboard__title">
            url.space
          </Link>
          <ul className="dashboard__list">
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M120 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8m0 424h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8m784 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8"
                  />
                </svg>
                All
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M923 283.6a260 260 0 0 0-56.9-82.8a264.4 264.4 0 0 0-84-55.5A265.3 265.3 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39q-15 9.15-28.5 20.1q-13.5-10.95-28.5-20.1c-41.8-25.5-89.9-39-139.2-39c-35.5 0-69.9 6.8-102.4 20.3c-31.4 13-59.7 31.7-84 55.5a258.4 258.4 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9c0 33.3 6.8 68 20.3 103.3c11.3 29.5 27.5 60.1 48.2 91c32.8 48.9 77.9 99.9 133.9 151.6c92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3c56-51.7 101.1-102.7 133.9-151.6c20.7-30.9 37-61.5 48.2-91c13.5-35.3 20.3-70 20.3-103.3c.1-35.3-7-69.6-20.9-101.9M512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5c0 201.2-356 429.3-356 429.3"
                  />
                </svg>
                Favourite
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32M324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3l6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39m563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5l48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5M396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5"
                  />
                </svg>
                Reading list
              </button>
            </li>
          </ul>
        </div>
        <div className="dashboard__section">
          <div className="dashboard__title">Collections</div>
          <ul className="dashboard__list">
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="dashbaord__icon"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8M104 228a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0"
                  />
                </svg>
                Some list here
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="dashbaord__icon"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8M104 228a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0"
                  />
                </svg>
                Tools
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="dashbaord__icon"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8M104 228a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 284a56 56 0 1 0 112 0a56 56 0 1 0-112 0"
                  />
                </svg>
                Conferences and meetups
              </button>
            </li>
          </ul>
          <button className="dashboard__list-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="dashbaord__icon"
              width="1em"
              height="1em"
              viewBox="0 0 1024 1024"
            >
              <path d="M0 0h1024v1024H0z" fill="none" />
              <path
                fill="currentColor"
                d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8"
              />
              <path
                fill="currentColor"
                d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"
              />
            </svg>
            Add collection
          </button>
        </div>
        <div className="dashboard__section">
          <div className="dashboard__title">Tags</div>
          <ul className="dashboard__list">
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="m938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8M459.7 834.7L189.3 564.3L589 164.6L836 188l23.4 247zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88s88-39.5 88-88s-39.5-88-88-88m0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32"
                  />
                </svg>
                frontend
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="m938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8M459.7 834.7L189.3 564.3L589 164.6L836 188l23.4 247zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88s88-39.5 88-88s-39.5-88-88-88m0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32"
                  />
                </svg>
                vinyl
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="m938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8M459.7 834.7L189.3 564.3L589 164.6L836 188l23.4 247zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88s88-39.5 88-88s-39.5-88-88-88m0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32"
                  />
                </svg>
                social
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="m938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8M459.7 834.7L189.3 564.3L589 164.6L836 188l23.4 247zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88s88-39.5 88-88s-39.5-88-88-88m0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32"
                  />
                </svg>
                cooking
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  className="dashbaord__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M0 0h1024v1024H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="m938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 0 0 0 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8M459.7 834.7L189.3 564.3L589 164.6L836 188l23.4 247zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88s88-39.5 88-88s-39.5-88-88-88m0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32"
                  />
                </svg>
                backend
              </button>
            </li>
          </ul>
          <button className="dashboard__list-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="dashbaord__icon"
              width="1em"
              height="1em"
              viewBox="0 0 1024 1024"
            >
              <path d="M0 0h1024v1024H0z" fill="none" />
              <path
                fill="currentColor"
                d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8"
              />
              <path
                fill="currentColor"
                d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"
              />
            </svg>
            Add tag
          </button>
        </div>
      </aside>
      <div className="dashbaord__links">
        {links.map((r) => (
          <article key={r.id}>
            <a href={r.url}>{r.title}</a> — {r.description}
          </article>
        ))}
      </div>
      <aside className="dashbaord__sidebar">
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>

        <h1>User</h1>
        <p>Username: {user.username}</p>
        <p>Display name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Pro: {user.isPro ? "Yes" : "No"}</p>
        <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>

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
      </aside>
    </div>
  );
}
