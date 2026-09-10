import { useState } from "react";
import type { CollectionRow } from "#/queries/collections.ts";
import { DashboardButton } from "..";
import Icon from "../Icons/Icons";
import styles from "./DashboardCollectionInfo.module.css";

function DashboardCollectionInfo({
  collection,
}: {
  collection: CollectionRow;
}) {
  const url = `https://url.space/collection/${collection.id}`;
  const [copyResult, setCopyResult] = useState<{
    url: string;
    success: boolean;
  } | null>(null);
  const copied = copyResult?.url === url && copyResult.success;
  const copyFailed = copyResult?.url === url && !copyResult.success;

  async function handleCopy() {
    setCopyResult(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopyResult({ url, success: true });
    } catch {
      setCopyResult({ url, success: false });
    }
  }

  return (
    <section>
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
              <div className={styles.row}>
                <a className={styles.value} href={url}>
                  {url}
                </a>
                <span className={styles.action}>
                  <DashboardButton
                    onClick={handleCopy}
                    text={copied ? "Copied!" : "Copy public URL"}
                    icon={<Icon.Copy />}
                  />
                </span>
              </div>
              <span className="visually-hidden" role="status">
                {copied ? "Public URL copied." : ""}
              </span>
              {copyFailed ? (
                <p role="alert">
                  Could not copy. Please copy the URL manually.
                </p>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export default DashboardCollectionInfo;
