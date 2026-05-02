import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <div className="app">
        <div className="app__header"></div>
        <div className="app__main">
          <Outlet />
        </div>
        <div className="app__footer">
          <Footer />
        </div>
      </div>
    </>
  );
}
