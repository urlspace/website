import { createFileRoute } from "@tanstack/react-router";
import { collectionsQueryOptions } from "#/queries/collections.ts";
import {
  ButtonDownload,
  DashboardButtonLink,
  FormImport,
  Heading,
  Icon,
  Logo,
  Stack,
} from "#/components/index.ts";

export const Route = createFileRoute("/_protected/tools")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(collectionsQueryOptions),
  component: PageTools,
  head: () => ({
    meta: [
      {
        title: "Tools | url.space",
      },
    ],
  }),
});

function PageTools() {
  return (
    <div className="page">
      <header className="page__header">
        <Logo to="/dashboard" />
        <DashboardButtonLink
          icon={<Icon.Back />}
          to="/dashboard"
          text="Back to dashboard"
        />
      </header>
      <main className="page__main">
        <Stack gap={2}>
          <Heading level={1} text="Tools" />

          <Stack gap={1}>
            <Heading level={2} text="Import" />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <FormImport />
          </Stack>

          <hr />

          <Stack gap={1}>
            <Heading level={2} text="Export" />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <ButtonDownload
              text="Export bookmarks"
              href="/tools/bookmarks.html"
            />
          </Stack>
        </Stack>
      </main>
    </div>
  );
}
