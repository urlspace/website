import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getCountry = createServerFn().handler(() =>
	getRequest().headers.get("cf-ipcountry"),
);
