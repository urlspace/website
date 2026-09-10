import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";

export const Route = createFileRoute("/.well-known/change-password")({
	server: {
		handlers: {
			GET: () => {
				const hasSession = getCookie("session") !== undefined;

				return new Response(null, {
					status: 302,
					headers: {
						Location: hasSession
							? "/settings"
							: "/auth/reset-password",
						"Cache-Control": "no-store",
					},
				});
			},
		},
	},
});
