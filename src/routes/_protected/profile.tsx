import { queryOptions, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";
import {
  Dashboard,
  DashboardButton,
  DashboardLogo,
  DashboardNavSecondary,
  DashboardSection,
  Drawer,
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

export const Route = createFileRoute("/_protected/profile")({
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
        title: "Profile | url.space",
      },
    ],
  }),
});

function PageProfile() {
  const { user } = useLoaderData({ from: "/_protected" });
  const router = useRouter();
  const queryClient = useQueryClient();

  function handleClearCache() {
    queryClient.invalidateQueries({ queryKey: ["links"] });
    queryClient.invalidateQueries({ queryKey: ["collections"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  }

  const [isNavOpen, setIsNavOpen] = useState(false);

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
      queryClient.clear();
      await router.invalidate();
      await router.navigate({ to: "/auth/signin" });
    }
  }

  return (
    <Dashboard>
      <Dashboard.Header>
        <DashboardLogo />
        <Stack direction="row" gap={0.5}>
          <DashboardButton
            icon={<Icon.Filter />}
            onClick={() => setIsNavOpen(true)}
            text="Menu"
          />
        </Stack>
      </Dashboard.Header>
      <Dashboard.Aside>
        <DashboardNavSecondary
          handleClearCache={handleClearCache}
          handleSignOut={handleSignOut}
        />
      </Dashboard.Aside>
      <Dashboard.Main>
        <DashboardSection>
          <Stack>
            <Heading level={1} text={`Profile (${user.username})`} />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Exercitationem, excepturi soluta? Odio, optio voluptas ratione
              quisquam temporibus laudantium corrupti cumque voluptatum vitae
              reiciendis, placeat debitis, ea magnam beatae provident?
              Voluptatem!
            </p>

            <ul>
              <li>Username: {user.username}</li>
              <li>Display name: {user.displayName}</li>
              <li>Email: {user.email}</li>
            </ul>
          </Stack>
        </DashboardSection>
        <DashboardSection>
          <Stack>
            <Heading level={2} text="Sessions" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Exercitationem, excepturi soluta? Odio, optio voluptas ratione
              quisquam temporibus laudantium corrupti cumque voluptatum vitae
              reiciendis, placeat debitis, ea magnam beatae provident?
              Voluptatem!
            </p>
          </Stack>
        </DashboardSection>
        <DashboardSection>
          <Stack>
            <Heading level={2} text="API Tokens" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Exercitationem, excepturi soluta? Odio, optio voluptas ratione
              quisquam temporibus laudantium corrupti cumque voluptatum vitae
              reiciendis, placeat debitis, ea magnam beatae provident?
              Voluptatem!
            </p>
          </Stack>
        </DashboardSection>
      </Dashboard.Main>

      <Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
        <DashboardNavSecondary
          handleClearCache={handleClearCache}
          handleSignOut={handleSignOut}
        />
      </Drawer>
    </Dashboard>
  );
}
