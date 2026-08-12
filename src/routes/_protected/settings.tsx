import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";
import {
  DashboardButton,
  DashboardButtonLink,
  DashboardLogo,
  Dialog,
  Heading,
  Icon,
  Stack,
} from "#/components/index.ts";
import { linksQueryOptions } from "#/queries/links.ts";

type CollectionRow = {
  id: string;
  name: string;
  description: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  count: number;
};

type TagRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  count: number;
};

const getCollections = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
    headers: { cookie },
  });
  if (!res.ok) throw new Error(`/collections failed: ${res.status}`);
  const json = (await res.json()) as { data: CollectionRow[] };
  return json.data ?? [];
});

const getTags = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/tags`, {
    headers: { cookie },
  });
  if (!res.ok) throw new Error(`/tags failed: ${res.status}`);
  const json = (await res.json()) as { data: TagRow[] };
  return json.data ?? [];
});

const collectionsQueryOptions = queryOptions({
  queryKey: ["collections"],
  queryFn: () => getCollections(),
  staleTime: 5 * 60 * 1000,
});

const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: () => getTags(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/_protected/settings")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(linksQueryOptions({ page: 1 })),
      context.queryClient.ensureQueryData(collectionsQueryOptions),
      context.queryClient.ensureQueryData(tagsQueryOptions),
    ]);
  },
  component: PageProfile,
  head: () => ({
    meta: [
      {
        title: "Settings | url.space",
      },
    ],
  }),
});

function PageProfile() {
  const { user } = useLoaderData({ from: "/_protected" });

  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isChangeDisplayNameOpen, setIsChangeDisplayNameOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="page">
      <header className="page__header">
        <DashboardLogo />
        <DashboardButtonLink
          icon={<Icon.Dashboard />}
          to="/dashboard"
          text="Back to dashboard"
        />
      </header>
      <main className="page__main">
        <Stack gap={2}>
          <Heading level={1} text="Settings" />

          <Stack gap={1}>
            <Heading level={2} text="Profile" />

            <dl className="settings">
              <div>
                <dt>Username</dt>
                <dd>
                  <span>{user.username}</span>
                  <DashboardButton
                    onClick={() => setIsChangeUsernameOpen(true)}
                    text="Change"
                    ariaLabel="Change username"
                  />
                </dd>
              </div>

              <div>
                <dt>Display name</dt>
                <dd>
                  <span>{user.displayName}</span>
                  <DashboardButton
                    onClick={() => setIsChangeDisplayNameOpen(true)}
                    text="Change"
                    ariaLabel="Change display name"
                  />
                </dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>
                  <span>{user.email}</span>
                  <DashboardButton
                    onClick={() => setIsChangeEmailOpen(true)}
                    text="Change"
                    ariaLabel="Change email"
                  />
                </dd>
              </div>
            </dl>
          </Stack>
          <Stack gap={1}>
            <Heading level={2} text="Security" />
            <dl className="settings">
              <div>
                <dt>Password</dt>
                <dd>
                  <span>************</span>
                  <DashboardButton
                    onClick={() => setIsChangePasswordOpen(true)}
                    text="Change"
                    ariaLabel="Change password"
                  />
                </dd>
              </div>
            </dl>
          </Stack>
          <Stack gap={1}>
            <Heading level={2} text="Sessions" />
            <p>list here</p>
          </Stack>
          <Stack gap={1}>
            <Heading level={2} text="API Tokens" />
            <p>list here</p>
          </Stack>
        </Stack>
      </main>

      <Dialog
        open={isChangeUsernameOpen}
        onClose={() => setIsChangeUsernameOpen(false)}
        title="Change username"
      >
        change username form
      </Dialog>

      <Dialog
        open={isChangeDisplayNameOpen}
        onClose={() => setIsChangeDisplayNameOpen(false)}
        title="Change display name"
      >
        change display name
      </Dialog>

      <Dialog
        open={isChangeEmailOpen}
        onClose={() => setIsChangeEmailOpen(false)}
        title="Change email"
      >
        change email
      </Dialog>

      <Dialog
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change password"
      >
        change password
      </Dialog>
    </div>
  );
}
