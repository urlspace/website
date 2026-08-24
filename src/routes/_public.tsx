import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: ComponentPage,
});

function ComponentPage() {
  return <Outlet />;
}
