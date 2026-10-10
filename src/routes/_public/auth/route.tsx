import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main
      style={{
        width: "min(calc(100% - 1rlh), 1200px)",
        marginInline: "auto",
        padding: "4rlh 1rlh",
        backgroundColor: "var(--color-bg-content)",
        boxShadow:
          "1px 0 0 0 var(--color-border), -1px 0 0 0 var(--color-border)",
      }}
    >
      <div style={{ maxWidth: "700px", marginInline: "auto" }}>
        <Outlet />
      </div>
    </main>
  );
}
