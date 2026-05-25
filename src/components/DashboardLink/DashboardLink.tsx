import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./DashboardLink.module.css";

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
}: {
  link: LinkRow;
  onTagClick: (tag: string) => void;
  onCollectionClick: (collectionId: string) => void;
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

  // im not destructuring other props because im lazy,
  // this is needed to avoid a type error because
  // narrowing doesn't survive across function boundaries
  const { collection } = link;

  return (
    <article
      className={[styles.link, isPending && styles.linkLoading].join(" ")}
      key={link.id}
    >
      <div className={styles.header}>
        <a
          href={link.url}
          className={styles.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.title}
        </a>
        <a
          href={link.url}
          className={styles.linkA}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.url}
        </a>
      </div>

      {link.description.length > 0 ? <p>{link.description}</p> : null}

      <div className={styles.meta}>
        <div>
          <span>Added: {link.createdAt.slice(0, 10).replaceAll("-", ".")}</span>
          {collection ? (
            <span className={styles.metaCollection}>
              Collection:{" "}
              <button
                type="button"
                className={styles.metaBtn}
                onClick={() => onCollectionClick(collection.id)}
              >
                {collection.name}
              </button>
            </span>
          ) : null}
        </div>

        {link.tags.length > 0 ? (
          <div>
            Tags:{" "}
            <ul className={styles.tags}>
              {link.tags.map((tag) => (
                <li key={tag.id} className={styles.tag}>
                  <button
                    type="button"
                    className={[styles.metaBtn, styles.metaBtnTag].join(" ")}
                    onClick={() => onTagClick(tag.id)}
                  >
                    {tag.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <menu className={styles.menu}>
          <li>
            <button
              type="button"
              className={styles.metaBtn}
              aria-pressed={link.favourite}
              onClick={() => updateLink.mutate({ favourite: !link.favourite })}
            >
              Favourite
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.metaBtn}
              aria-pressed={link.forLater}
              onClick={() => updateLink.mutate({ forLater: !link.forLater })}
            >
              For later
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.metaBtn}
              onClick={() => alert("Show edit dialog")}
            >
              Edit
            </button>
          </li>
          <li>
            <button
              type="button"
              className={[styles.metaBtn, styles.metaBtnDelete].join(" ")}
              onClick={() => deleteLink.mutate()}
            >
              Delete
            </button>
          </li>
        </menu>
      </div>
    </article>
  );
}

export default DashbrardLink;
