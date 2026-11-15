import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button, ButtonLink, Heading, Icon } from "#/components";
import type { User } from "#/queries/me.ts";
import { getLocalPrice } from "#/utils/getLocalPrice.ts";

import styles from "./Pricing.module.css";

function Pricing({
	hasSession,
	country,
}: {
	hasSession: boolean;
	country: string | null;
}) {
	const queryClient = useQueryClient();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Not meQueryOptions: its 401 handling redirects to sign-in, which a public
	// page must not do for a visitor with an expired cookie.
	const { data: user } = useQuery({
		queryKey: ["me", "pricing"],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
				credentials: "include",
			});
			if (res.status === 401) return null;
			if (!res.ok) throw new Error(`/me failed: ${res.status}`);
			return ((await res.json()) as { data: User }).data;
		},
		enabled: hasSession,
	});

	const createCheckout = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/subscriptions/checkout`,
				{ method: "POST", credentials: "include" },
			);
			if (res.status === 401) {
				window.location.assign("/auth/signin");
				throw new Error("Session expired.");
			}
			if (res.status === 409) return null;
			if (!res.ok) throw new Error(`create checkout failed: ${res.status}`);
			const json = (await res.json()) as { data: { url: string } };
			return json.data.url;
		},
		onSuccess: (url) => {
			if (url === null) {
				return queryClient.invalidateQueries({ queryKey: ["me"] });
			}
			window.location.assign(url);
		},
		onError: () => {
			setErrorMessage("We couldn't start the upgrade. Please try again.");
		},
	});

	const isRedirecting = createCheckout.isPending || createCheckout.isSuccess;
	let action: React.ReactNode = null;
	if (!hasSession || user === null) {
		action = <ButtonLink to="/auth/signup" text="Sign up for free" />;
	} else if (user && !user.isPro && !user.isAdmin) {
		action = (
			<Button
				type="button"
				disabled={isRedirecting}
				onClick={() => {
					setErrorMessage(null);
					createCheckout.mutate();
				}}
				text={isRedirecting ? "Redirecting..." : "Upgrade account"}
			/>
		);
	}

	return (
		<section className={styles.wrapper} id="pricing">
			<div className={styles.grid}>
				<div className={styles.plan}>
					<Heading level={2} text="Free" />

					<dl className={styles.list}>
						<div className={styles.item}>
							<dt className={styles.term}>Links</dt>
							<dd className={styles.value}>Up to 1000</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>Collections and tags</dt>
							<dd className={styles.value}>Up to 100</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>Public collections and profile</dt>
							<dd className={styles.value}>Not included</dd>
						</div>
					</dl>

					<div>
						<span className={styles.price}>{getLocalPrice(0, country)}</span>{" "}
						<span>forever</span>
					</div>
				</div>

				<div className={styles.plan}>
					<Heading level={2} text="Paid" />

					<dl className={styles.list}>
						<div className={styles.item}>
							<dt className={styles.term}>Links</dt>
							<dd className={styles.value}>Unlimited</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>Collections and tags</dt>
							<dd className={styles.value}>Unlimited</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>Public collections and profile</dt>
							<dd className={styles.value}>Included</dd>
						</div>
					</dl>

					<div>
						<span className={styles.price}>{getLocalPrice(30, country)}</span>{" "}
						<span>a year or {getLocalPrice(3, country)} a month</span>
					</div>
				</div>
			</div>

			{action ? <div className={styles.action}>{action}</div> : null}
			{errorMessage ? <p role="alert">{errorMessage}</p> : null}

			<div className={styles.faq}>
				<Heading level={2} text="Frequently asked questions" bg="bg" />
				<div>
					<details className={styles.question}>
						<summary className={styles.summary}>
							One
							<Icon.ChevronDown />
						</summary>
						<p>
							Lorem ipsum dolor sit, amet consectetur adipisicing elit.
							Assumenda sunt quia dolorum placeat a tempore eius blanditiis
							nesciunt omnis iusto!
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							Two
							<Icon.ChevronDown />
						</summary>
						<p>
							Lorem ipsum dolor sit, amet consectetur adipisicing elit.
							Assumenda sunt quia dolorum placeat a tempore eius blanditiis
							nesciunt omnis iusto!
						</p>
					</details>
				</div>
			</div>
		</section>
	);
}

export default Pricing;
