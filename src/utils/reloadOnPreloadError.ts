// After a deploy, open tabs request old chunks that no longer exist, and Vite
// fires vite:preloadError. Reload to get the new build. The sessionStorage
// timestamp allows one reload per 10s, so a broken deploy can't loop.
export function reloadOnPreloadError(event: Event) {
	try {
		const last = Number(sessionStorage.getItem("preloadErrorReloadAt") ?? 0);
		if (Date.now() - last < 10_000) {
			return;
		}
		sessionStorage.setItem("preloadErrorReloadAt", String(Date.now()));
	} catch {
		return;
	}
	event.preventDefault();
	window.location.reload();
}
