import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
