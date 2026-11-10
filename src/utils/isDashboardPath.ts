const dashboardPaths = ["/dashboard", "/settings", "/tools"];

export function isDashboardPath(pathname: string) {
	return dashboardPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);
}
