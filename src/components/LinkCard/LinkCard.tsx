import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type LinkRow, linksQueryKey } from "#/queries/links.ts";
import { formatDate } from "#/utils.ts";
import { DashboardButtonAction, DashboardMenu } from "..";
import styles from "./LinkCard.module.css";

const HOLD_TO_DELETE_MS = 700;

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

function LinkCard({
  link,
  onTagClick,
  onCollectionClick,
  onEdit,
  loading,
  query,
}: {
  link: LinkRow;
  onTagClick: (tagId: string) => void;
  onCollectionClick: (collectionId: string) => void;
  onEdit: (link: LinkRow) => void;
  loading: boolean;
  query: string;
}) {
  const queryClient = useQueryClient();

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
  const [isHolding, setIsHolding] = useState(false);

  // Hold-to-delete: deletes after HOLD_TO_DELETE_MS of holding d. Window blur
  // cancels, since the keyup would never arrive.
  useEffect(() => {
    if (!isHolding) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setIsHolding(false);
      deleteLink.mutate();
    }, HOLD_TO_DELETE_MS);
    function cancel() {
      setIsHolding(false);
    }
    window.addEventListener("blur", cancel);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("blur", cancel);
    };
  }, [isHolding, deleteLink.mutate]);

  const {
    collection,
    id,
    url,
    title,
    description,
    createdAt,
    tags,
    favourite,
    forLater,
  } = link;

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || isPending) {
      return;
    }
    switch (e.key) {
      case "f":
        updateLink.mutate({ favourite: !favourite });
        break;
      case "l":
        updateLink.mutate({ forLater: !forLater });
        break;
      case "e":
        onEdit(link);
        break;
      case "d":
        setIsHolding(true);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key.toLowerCase() === "d") {
      setIsHolding(false);
    }
  }

  // Cancel the hold when focus leaves the card (j/k, Tab, click), otherwise
  // the d keyup lands elsewhere and the card we left gets deleted.
  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsHolding(false);
    }
  }

  return (
    <article
      className={[styles.link, isPending && styles.linkLoading]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={id}
      aria-busy={isPending || undefined}
      style={{ "--hold-ms": `${HOLD_TO_DELETE_MS}ms` } as React.CSSProperties}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      <div>
        <h2 id={id} className={styles.title}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-description="Opens in a new tab"
          >
            {highlight(title, query)}
          </a>
        </h2>
        <p className={styles.url}>{url}</p>
      </div>

      {description.trim().length > 0 ? <p>{description}</p> : null}

      <div className={styles.meta}>
        <dl>
          <div className={styles.metaItem}>
            <dt>{"Added: "}</dt>
            <dd>
              <time dateTime={createdAt}>{formatDate(createdAt)}</time>
            </dd>
          </div>

          {collection ? (
            <div className={styles.metaItem}>
              <dt>{"Collection: "}</dt>
              <dd>
                <button
                  type="button"
                  className={styles.metaButton}
                  aria-description="Show all links in this collection"
                  aria-disabled={isPending || undefined}
                  onClick={
                    isPending
                      ? undefined
                      : () => onCollectionClick(collection.id)
                  }
                >
                  {collection.name}
                </button>
              </dd>
            </div>
          ) : null}

          {tags.length > 0 ? (
            <div className={styles.metaItem}>
              <dt>{"Tags: "}</dt>
              <dd>
                <ul className={styles.tags} role="list">
                  {tags.map((tag) => (
                    <li key={tag.id} className={styles.tag}>
                      <button
                        type="button"
                        className={styles.metaButton}
                        aria-description="Show all links with this tag"
                        aria-disabled={isPending || undefined}
                        onClick={
                          isPending ? undefined : () => onTagClick(tag.id)
                        }
                      >
                        {tag.name}
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
              ariaPressed={favourite}
              ariaLabel={`Favourite "${title}"`}
              ariaKeyShortcuts="f"
              disabled={isPending}
              onClick={() => updateLink.mutate({ favourite: !favourite })}
              text="Favourite"
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              ariaPressed={forLater}
              ariaLabel={`For later "${title}"`}
              ariaKeyShortcuts="l"
              disabled={isPending}
              onClick={() => updateLink.mutate({ forLater: !forLater })}
              text="For later"
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              text="Edit"
              ariaLabel={`Edit "${title}"`}
              ariaKeyShortcuts="e"
              disabled={isPending}
              onClick={() => onEdit(link)}
            />
          </DashboardMenu.Li>
          <DashboardMenu.Li>
            <DashboardButtonAction
              text="Delete"
              ariaLabel={`Delete "${title}"`}
              ariaKeyShortcuts="d"
              disabled={isPending}
              onClick={() => deleteLink.mutate()}
              destructive
              holding={isHolding}
            />
          </DashboardMenu.Li>
        </DashboardMenu>
      </div>
    </article>
  );
}

export default LinkCard;
