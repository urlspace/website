import { Stack, Heading } from "#/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: App,
});

function App() {
  return (
    <Stack>
      <Heading text="url.space" level={1} />
      <p>
        A bookmarking service for people who love the web. Save, organise and
        share links. Open source, no ads, no tracking, no AI. Free for everyday
        use, with power-user features for a small fee.
      </p>
    </Stack>
  );
}
