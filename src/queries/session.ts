import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";

export const clearSession = createServerFn({ method: "POST" }).handler(() => {
	deleteCookie("session", {
		path: "/",
		secure: true,
		domain: import.meta.env.VITE_API_URL.includes("localhost")
			? ""
			: ".url.space",
	});
});
