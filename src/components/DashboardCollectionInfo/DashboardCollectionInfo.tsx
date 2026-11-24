import { useId } from "react";

import type { CollectionRow } from "#/queries/collections.ts";
import { siteUrl } from "#/utils/urls.ts";

import { CopyBox, Button, Icon } from "..";

import styles from "./DashboardCollectionInfo.module.css";

function DashboardCollectionInfo({
	collection,
	username,
	onAddLink,
	onEdit,
	onDelete,
}: {
	collection: CollectionRow;
	username: string;
	onAddLink: () => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const headingId = useId();
	const url = `${siteUrl}/${username}/${collection.slug}`;

	return (
		<section className={styles.wrapper} aria-labelledby={headingId}>
			<div className={styles.content}>
				<h2 id={headingId} className="visually-hidden">
					Collection details
				</h2>
				<dl className={styles.list}>
					<div className={styles.item}>
						<dt className={styles.term}>Collection</dt>
						<dd className={styles.name}>{collection.name}</dd>
					</div>
					{collection.description.trim() !== "" ? (
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
					{collection.password !== null ? (
						<div className={styles.item}>
							<dt className={styles.term}>Password</dt>
							<dd>
								<CopyBox value={collection.password} label="Password" />
							</dd>
						</div>
					) : null}
				</dl>
				<div className={styles.buttons}>
						<Button
							ariaLabel={`Add link to ${collection.name}`}
							icon={<Icon.Plus />}
							onClick={onAddLink}
							text="Add link"
						/>

						<Button
							ariaLabel={`Edit collection "${collection.name}"`}
							icon={<Icon.Edit />}
							onClick={onEdit}
							text="Edit"
						/>

					<Button
							ariaLabel={`Delete collection "${collection.name}"`}
						icon={<Icon.Trash />}
						onClick={onDelete}
						text="Delete"
						destructive
					/>
				</div>
			</div>
		</section>
	);
}

export default DashboardCollectionInfo;
