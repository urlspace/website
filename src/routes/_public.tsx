import { createFileRoute, Outlet } from "@tanstack/react-router";
import { App, Header, Footer } from "../components";

export const Route = createFileRoute("/_public")({
  component: ComponentPage,
});

function ComponentPage() {
  return (
    <App>
      <App.Header>
        <Header />
      </App.Header>
      <App.Main>
        <Outlet />
      </App.Main>
      <App.Footer>
        <Footer />
      </App.Footer>
    </App>
  );
}
