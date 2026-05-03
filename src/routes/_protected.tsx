import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getRequest } from "@tanstack/react-start/server";

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
  const res = await fetch("http://localhost:3000/v1/me", {
    headers: { cookie },
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/me failed: ${res.status}`);
  const json = (await res.json()) as { data: User };
  return json.data;
});

const clearSession = createServerFn({ method: "POST" }).handler(() => {
  deleteCookie("session_id", { path: "/" });
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
  component: RouteComponent,
  errorComponent: GenericError,
  preload: false,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function GenericError() {
  return (
    <main>
      <h1>Error protected</h1>
      <p>Generic error</p>
    </main>
  );
}
