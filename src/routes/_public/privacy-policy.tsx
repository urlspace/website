import { Heading, Page, Stack } from "#/components/index.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy-policy")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Privacy policy | url.space",
      },
    ],
  }),
});

function App() {
  return (
    <Page>
      <Stack>
        <Heading level={1} text="Privacy policy" />
        TBC
      </Stack>
    </Page>
  );
}
