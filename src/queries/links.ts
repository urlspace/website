import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type LinkRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
  collection: {
    id: string;
    name: string;
  } | null;
  favourite: boolean;
  forLater: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type LinksResponse = {
  data: LinkRow[];
  pagination: Pagination;
};

export type LinkFilters = {
  page: number;
  query?: string;
  collectionId?: string;
  tagIds?: string[];
  favourite?: true;
  forLater?: true;
};

const getLinks = createServerFn()
  // Identity validator — only used to type the handler input. Runtime
  // validation lives on the API; this layer just forwards.
  .inputValidator((filters: LinkFilters) => filters)
  .handler(async ({ data: filters }) => {
    const cookie = getRequest().headers.get("cookie") ?? "";
    const params = new URLSearchParams();
    params.set("page", String(filters.page));
    params.set("pageSize", "100");
    if (filters.query) params.set("query", filters.query);
    if (filters.collectionId) params.set("collectionId", filters.collectionId);
    if (filters.favourite) params.set("favourite", "true");
    if (filters.forLater) params.set("forLater", "true");
    if (filters.tagIds) {
      for (const id of filters.tagIds) params.append("tagId", id);
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/links?${params}`, {
      headers: { cookie },
    });
    if (!res.ok) throw new Error(`/links failed: ${res.status}`);
    return (await res.json()) as LinksResponse;
  });

export const linksQueryOptions = (filters: LinkFilters) => {
  // Normalize tagIds order so different click sequences land on the same cache key.
  const normalized: LinkFilters = filters.tagIds
    ? { ...filters, tagIds: [...filters.tagIds].sort() }
    : filters;
  return queryOptions({
    queryKey: ["links", normalized],
    queryFn: () => getLinks({ data: normalized }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
