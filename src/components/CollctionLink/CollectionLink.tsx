import { useId } from "react";
import { formatDate } from "#/utils.ts";
import styles from "./CollectionLink.module.css";

function CollectionLink({
  id,
  title,
  description,
  url,
  createdAt,
}: {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}) {
  const newTabHintId = useId();

  return (
    <article className={styles.link} key={id} aria-labelledby={id}>
      <div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.container}
          aria-describedby={newTabHintId}
        >
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
          <span className={styles.linkA}>{url}</span>
        </a>
        <span id={newTabHintId} className="visually-hidden">
          Opens in a new tab.
        </span>
      </div>

      {description.length > 0 ? <p>{description}</p> : null}

      <div className={styles.meta}>
        <dl>
          <div className={styles.metaItem}>
            <dt>{"Added: "}</dt>
            <dd>
              <time dateTime={createdAt}>{formatDate(createdAt)}</time>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default CollectionLink;
