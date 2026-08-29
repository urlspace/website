import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linksQueryKey } from "#/queries/links.ts";
import { DashboardButtonAction, DashboardMenu } from "..";
import Truncate from "../Truncate/Truncate";
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
		>
			<div>
				<a
					href={link.url}
					className={styles.title}
					target="_blank"
					rel="noopener noreferrer"
				>
					{highlight(link.title, query)}
				</a>
				<Truncate>
					<a
						href={link.url}
						className={styles.linkA}
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.url}
					</a>
				</Truncate>
			</div>

			{link.description.length > 0 ? <p>{link.description}</p> : null}

			<div className={styles.meta}>
				<div>
					<span>Added: {link.createdAt.slice(0, 10).replaceAll("-", ".")}</span>
				</div>

				{collection ? (
					<div>
						Collection:{" "}
						<DashboardButtonAction
							onClick={() => onCollectionClick(collection.id)}
							text={collection.name}
						/>
					</div>
				) : null}

				{link.tags.length > 0 ? (
					<div>
						Tags:{" "}
						<ul className={styles.tags}>
							{link.tags.map((tag) => (
								<li key={tag.id} className={styles.tag}>
									<DashboardButtonAction
										onClick={() => onTagClick(tag.id)}
										text={`#${tag.name}`}
									/>
								</li>
							))}
						</ul>
					</div>
				) : null}

				<DashboardMenu>
					<DashboardMenu.Li>
						<DashboardButtonAction
							ariaPressed={link.favourite}
							onClick={() => updateLink.mutate({ favourite: !link.favourite })}
							text="Favourite"
						/>
					</DashboardMenu.Li>
					<DashboardMenu.Li>
						<DashboardButtonAction
							ariaPressed={link.forLater}
							onClick={() => updateLink.mutate({ forLater: !link.forLater })}
							text="For later"
						/>
					</DashboardMenu.Li>
					<DashboardMenu.Li>
						<DashboardButtonAction text="Edit" onClick={() => onEdit(link)} />
					</DashboardMenu.Li>
					<DashboardMenu.Li>
						<DashboardButtonAction
							text="Delete"
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
