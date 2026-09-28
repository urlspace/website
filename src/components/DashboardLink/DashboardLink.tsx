import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { linksQueryKey } from "#/queries/links.ts";
import { formatDate } from "#/utils.ts";
import { DashboardButtonAction, DashboardMenu } from "..";
import styles from "./DashboardLink.module.css";

function highlight(text: string, query: string): React.ReactNode {
  const needle = query.trim();
  if (!needle) return text;
  // Escape regex metacharacters so a search like "C++" doesn't blow up.
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Capturing group: split returns [before, match, between, match, ..., after].
  // Even indices are non-matches, odd indices are the matches.
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    // biome-ignore lint/suspicious/noArrayIndexKey: index is the meaningful identifier here (even=text, odd=match)
    i % 2 === 1 ? <mark key={i}>{part}</mark> : part,
  );
}

type LinkRow = {
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

function DashbrardLink({
  link,
  onTagClick,
  onCollectionClick,
  onEdit,
  loading,
  query,
}: {
  link: LinkRow;
  onTagClick: (tag: string) => void;
  onCollectionClick: (collectionId: string) => void;
  onEdit: (link: LinkRow) => void;
  loading: boolean;
  query: string;
}) {
  const queryClient = useQueryClient();
  const newTabHintId = useId();

  const updateLink = useMutation({
    mutationFn: async (patch: { favourite?: boolean; forLater?: boolean }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/links/${link.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: link.title,
            description: link.description,
            url: link.url,
            favourite: link.favourite,
            forLater: link.forLater,
            tags: link.tags.map((t) => t.name),
            collectionId: link.collection?.id ?? null,
            ...patch,
          }),
        },
      );
      // Reload so the route guard can clear the invalid session and cached data.
      if (
        res.status === 401 &&
        ((await res.clone().json()) as { data: string }).data === "unauthorized"
      ) {
        window.location.reload();
        throw new Error("Session expired.");
      }

      if (!res.ok)
        throw new Error(`PUT /links/${link.id} failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linksQueryKey }),
  });

  const deleteLink = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/links/${link.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      // Reload so the route guard can clear the invalid session and cached data.
      if (
        res.status === 401 &&
        ((await res.clone().json()) as { data: string }).data === "unauthorized"
      ) {
        window.location.reload();
        throw new Error("Session expired.");
      }

      if (!res.ok)
        throw new Error(`DELETE /links/${link.id} failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linksQueryKey }),
  });

  const isPending = updateLink.isPending || deleteLink.isPending || loading;

  // im not destructuring other props because im lazy,
  // this is needed to avoid a type error because
  // narrowing doesn't survive across function boundaries
  const { collection } = link;

  return (
    <article
      className={[styles.link, isPending && styles.linkLoading].join(" ")}
      key={link.id}
      aria-labelledby={link.id}
      aria-busy={isPending}
    >
      <div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.container}
          aria-describedby={newTabHintId}
        >
          <h2 id={link.id} className={styles.title}>
            {highlight(link.title, query)}
          </h2>
          <span className={styles.linkA}>{link.url}</span>
        </a>
        <span id={newTabHintId} className="visually-hidden">
          Opens in a new tab.
        </span>
      </div>

      {link.description.length > 0 ? <p>{link.description}</p> : null}

      <div className={styles.meta}>
        <dl>
          <div className={styles.metaItem}>
            <dt>{"Added: "}</dt>
            <dd>
              <time dateTime={link.createdAt}>
                {formatDate(link.createdAt)}
              </time>
            </dd>
          </div>

          {collection ? (
            <div className={styles.metaItem}>
              <dt>{"Collection: "}</dt>
              <dd>
                <button
                  type="button"
                  className={styles.metaButton}
                  disabled={isPending}
                  onClick={() => onCollectionClick(collection.id)}
                >
                  {collection.name}
                </button>
              </dd>
            </div>
          ) : null}

          {link.tags.length > 0 ? (
            <div className={styles.metaItem}>
              <dt>{"Tags: "}</dt>
              <dd>
                <ul className={styles.tags}>
                  {link.tags.map((tag) => (
                    <li key={tag.id} className={styles.tag}>
                      <button
                        type="button"
                        className={styles.metaButton}
                        disabled={isPending}
                        onClick={() => onTagClick(tag.id)}
                      >
                        {`#${tag.name}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>

        <DashboardMenu>
          <DashboardMenu.Li>
            <DashboardButtonAction
              ariaPressed={link.favourite}
              ariaLabel={`Favourite: ${link.title}`}
              disabled={isPending}
              onClick={() => updateLink.mutate({ favourite: !link.favourite })}
              text="Favourite"
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              ariaPressed={link.forLater}
              ariaLabel={`For later: ${link.title}`}
              disabled={isPending}
              onClick={() => updateLink.mutate({ forLater: !link.forLater })}
              text="For later"
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              text="Edit"
              ariaLabel={`Edit ${link.title}`}
              disabled={isPending}
              onClick={() => onEdit(link)}
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              text="Delete"
              ariaLabel={`Delete ${link.title}`}
              disabled={isPending}
              onClick={() => deleteLink.mutate()}
              destructive
            />
          </DashboardMenu.Li>
        </DashboardMenu>
      </div>
    </article>
  );
}

export default DashbrardLink;
