import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import styles from "./DashboardLink.module.css";

type Link = {
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

function DashbrardLink({ link }: { link: Link }) {
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
      if (!res.ok)
        throw new Error(`PUT /links/${link.id} failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
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
      if (!res.ok)
        throw new Error(`DELETE /links/${link.id} failed: ${res.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const isPending = updateLink.isPending || deleteLink.isPending;

  return (
    <article
      className={[styles.link, isPending && styles.linkLoading].join(" ")}
      key={link.id}
    >
      <div className={styles.header}>
        <a href={link.url} className={styles.title}>
          {link.title}
        </a>
        <a href={link.url} className={styles.linkA}>
          {link.url}
        </a>
      </div>

      {link.description.length > 0 ? <p>{link.description}</p> : null}

      {link.collection ? <p>{link.collection.name}</p> : null}

      {link.tags.length > 0 ? (
        <ul className={styles.tags}>
          {link.tags.map((tag) => (
            <li key={tag.id} className={styles.tag}>
              {tag.name}
            </li>
          ))}
        </ul>
      ) : null}

      <ul className={styles.meta}>
        <li>{link.createdAt.slice(0, 10).replaceAll("-", ".")}</li>
        <li>
          <button
            className={styles.metaBtn}
            aria-pressed={link.favourite}
            onClick={() => updateLink.mutate({ favourite: !link.favourite })}
          >
            Favourite
          </button>
        </li>
        <li>
          <button
            className={styles.metaBtn}
            aria-pressed={link.forLater}
            onClick={() => updateLink.mutate({ forLater: !link.forLater })}
          >
            For later
          </button>
        </li>
        <li>
          <button
            className={[styles.metaBtn, styles.metaBtnDelete].join(" ")}
            onClick={() => deleteLink.mutate()}
          >
            Delete
          </button>
        </li>
      </ul>
    </article>
  );
}

export default DashbrardLink;
