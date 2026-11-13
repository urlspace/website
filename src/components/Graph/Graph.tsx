import { useEffect, useRef, useState } from "react";
import { Icon } from "#/components";

import styles from "./Graph.module.css";

const initialCounts = {
	all: 187,
	favourite: 12,
	forLater: 33,
	golang: 18,
	productivity: 37,
	garden: 14,
	courses: 40,
	conferenceTalks: 31,
};

const flagsAndTags = ["favourite", "forLater", "golang", "productivity"] as const;
const collections = ["garden", "courses", "conferenceTalks"] as const;

function Graph() {
	const [counts, setCounts] = useState(initialCounts);

	function handleArrive() {
		const added = flagsAndTags.filter(
			(key) => Math.random() < initialCounts[key] / initialCounts.all,
		);

		// weighted pick: lands on a collection proportionally to its share, or none
		let roll = Math.random() * initialCounts.all;
		const collection = collections.find(
			(key) => (roll -= initialCounts[key]) < 0,
		);

		setCounts((c) => {
			const next = { ...c, all: c.all + 1 };
			for (const key of added) next[key] += 1;
			if (collection) next[collection] += 1;
			return next;
		});
	}

	return (
		<div className={styles.graph} aria-hidden="true">
			<div className={styles.rows}>
				<div className={styles.row}>
					<Label
						icon={<Icon.List />}
						text="All"
						counter={counts.all}
						onArrive={handleArrive}
					/>
					<Label
						icon={<Icon.Heart />}
						text="Favourite"
						counter={counts.favourite}
					/>
					<Label
						icon={<Icon.Coffee />}
						text="For later"
						counter={counts.forLater}
					/>
				</div>
				<div className={styles.row}>
					<Label icon={<Icon.Tag />} text="golang" counter={counts.golang} />
					<Label
						icon={<Icon.Tag />}
						text="productivity"
						counter={counts.productivity}
					/>
				</div>
				<div className={styles.row}>
					<Label icon={<Icon.Folder />} text="Garden" counter={counts.garden} />
					<Label
						icon={<Icon.FolderPublic />}
						text="Courses"
						counter={counts.courses}
						url="https://url.space/anna/courses"
					/>
					<Label
						icon={<Icon.Folder />}
						text="Conference Talks"
						counter={counts.conferenceTalks}
					/>
				</div>
			</div>
		</div>
	);
}

function Label({
	icon,
	text,
	counter,
	url,
	onArrive,
}: {
	icon: React.ReactNode;
	text: string;
	counter: number;
	url?: string;
	onArrive?: () => void;
}) {
	const labelRef = useRef<HTMLDivElement>(null);
	const prevCounter = useRef(counter);

	useEffect(() => {
		if (prevCounter.current === counter) return;
		prevCounter.current = counter;
		labelRef.current?.animate(
			[{ scale: 1 }, { scale: 1.03 }, { scale: 1 }],
			{ duration: 220, easing: "ease-in-out" },
		);
	}, [counter]);

	return (
		<div className={styles.wrapper}>
			{onArrive ? <Flow onArrive={onArrive} /> : null}
			<div ref={labelRef} className={styles.label}>
				{icon}
				<div className={styles.labelText}>
					{text} <span className={styles.labelCounter}>({counter})</span>
				</div>
			</div>
			{url ? <div className={styles.url}>{url}</div> : null}
		</div>
	);
}

const flowDuration = 1.5;

const flowPaths = [
	{
		d: "M 0 -140 V 104 A 4 4 0 0 0 4 108 H 31 A 4 4 0 0 1 35 112 V 140",
		interval: 13,
	},
	{
		d: "M 183 -140 V 71 A 4 4 0 0 1 179 75 H 39 A 4 4 0 0 0 35 79 V 140",
		interval: 7,
	},
	{
		d: "M 288 -140 V 93 A 4 4 0 0 1 284 97 H 39 A 4 4 0 0 0 35 101 V 140",
		interval: 17,
	},
];

function Flow({ onArrive }: { onArrive: () => void }) {
	return (
		<svg
			className={styles.flow}
			viewBox="0 0 290 140"
			width={290}
			height={140}
			onAnimationIteration={onArrive}
		>
			{flowPaths.map(({ d }) => (
				<path key={d} d={d} />
			))}
			{flowPaths.map(({ d, interval }) => (
				<circle
					key={d}
					className={styles.dot}
					r={4}
					style={{
						offsetPath: `path("${d}")`,
						animationDuration: `${interval}s`,
						animationTimingFunction: `linear(0, 0 ${(1 - flowDuration / interval) * 100}%, 1)`,
					}}
				/>
			))}
		</svg>
	);
}

export default Graph;
