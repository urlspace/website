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
  return (
    <article className={styles.link} key={link.id}>
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
          <button className={styles.metaBtn} aria-pressed={link.favourite}>
            Favourite
          </button>
        </li>
        <li>
          <button className={styles.metaBtn} aria-pressed={link.forLater}>
            For later
          </button>
        </li>
        <li>
          <button className={[styles.metaBtn, styles.metaBtnDelete].join(" ")}>
            Delete
          </button>
        </li>
      </ul>
    </article>
  );
}

export default DashbrardLink;
