import { Link } from "@tanstack/react-router";
import { formatDate } from "#/utils.ts";
import styles from "./LinkCard.module.css";

function LinkCardSlim({
  id,
  title,
  description,
  createdAt,
  url,
  internal = false,
}: {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  url: string;
  internal?: boolean;
}) {
  return (
    <article className={styles.link} aria-labelledby={id}>
      <div>
        <h3 id={id} className={styles.title}>
          {internal ? (
            <Link to={url}>{title}</Link>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-description="Opens in a new tab"
            >
              {title}
            </a>
          )}
        </h3>
        {internal ? null : <p className={styles.url}>{url}</p>}
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
        </dl>
      </div>
    </article>
  );
}

export default LinkCardSlim;
