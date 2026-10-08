import type { CollectionRow } from "#/queries/collections.ts";
import { CopyBox } from "..";
import styles from "./DashboardCollectionInfo.module.css";

function DashboardCollectionInfo({
  collection,
  username,
}: {
  collection: CollectionRow;
  username: string;
}) {
  const url = `${window.location.origin}/${username}/${collection.slug}`;

  return (
    <section className={styles.wrapper}>
      <dl className={styles.list}>
        <div className={styles.item}>
          <dt className={styles.term}>Collection</dt>
          <dd className={styles.name}>{collection.name}</dd>
        </div>
        {collection.description !== "" ? (
          <div className={styles.item}>
            <dt className={styles.term}>Description</dt>
            <dd>{collection.description}</dd>
          </div>
        ) : null}
        {collection.public ? (
          <div className={styles.item}>
            <dt className={styles.term}>Public URL</dt>
            <dd>
              <CopyBox value={url} label="Public URL" />
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export default DashboardCollectionInfo;
