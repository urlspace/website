import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getCountry = createServerFn().handler(() =>
	getRequest().headers.get("cf-ipcountry"),
);

export const countryQueryOptions = queryOptions({
	queryKey: ["country"],
	queryFn: () => getCountry(),
	staleTime: "static",
});
