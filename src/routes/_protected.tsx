import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getRequest } from "@tanstack/react-start/server";
import { App } from "../components";

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
};

const getUser = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
    headers: { cookie },
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/me failed: ${res.status}`);
  const json = (await res.json()) as { data: User };
  return json.data;
});

const clearSession = createServerFn({ method: "POST" }).handler(() => {
  deleteCookie("session", { path: "/", secure: true });
});

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    if (!context.hasSession)
      throw redirect({
        to: "/auth/signin",
      });
  },
  loader: async () => {
    const user = await getUser();
    if (!user) {
      await clearSession();
      throw redirect({
        to: "/auth/signin",
      });
    }
    return { user };
  },
  staleTime: 5 * 60 * 1000,
  component: ComponentPage,
  errorComponent: ComponentError,
  preload: false,
  head: () => ({
    meta: [
      {
        title: "Dashboard | url.space",
      },
    ],
  }),
});

function ComponentPage() {
  return (
    <App>
      <App.Main>
        <Outlet />
      </App.Main>
    </App>
  );
}

function ComponentError() {
  return (
    <App.Main>
      <h1>Error protected</h1>
      <p>Generic error</p>
    </App.Main>
  );
}
