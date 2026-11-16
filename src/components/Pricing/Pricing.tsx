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
				{
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ returnTo: "home" }),
				},
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
	} else if (user && !user.isUnlimited && !user.isAdmin) {
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
							<dt className={styles.term}>
								Public and password protected collections
							</dt>
							<dd className={styles.value}>Not included</dd>
						</div>
					</dl>

					<div>
						<span className={styles.price}>{getLocalPrice(0, country)}</span>{" "}
						<span>forever</span>
					</div>
				</div>

				<div className={styles.plan}>
					<Heading level={2} text="Unlimited" />
					<dl className={styles.list}>
						<div className={styles.item}>
							<dt className={styles.term}>Links</dt>
							<dd className={styles.value}>
								Unlimited
								<a href="#fair-use" aria-label="Fair use policy">
									*
								</a>
							</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>Collections and tags</dt>
							<dd className={styles.value}>
								Unlimited
								<a href="#fair-use" aria-label="Fair use policy">
									*
								</a>
							</dd>
						</div>
						<div className={styles.item}>
							<dt className={styles.term}>
								Public and password protected collections
							</dt>
							<dd className={styles.value}>Included</dd>
						</div>
					</dl>
					<div>
						<span className={styles.price}>{getLocalPrice(30, country)}</span>{" "}
						<span>a year or {getLocalPrice(3, country)} a month</span>
					</div>
				</div>

				<p className={styles.fairUse} id="fair-use">
					<small>
						* Unlimited for people, not bots. Automated or abusive use may get
						your account limited or suspended.
					</small>
				</p>
			</div>

			{action ? <div className={styles.action}>{action}</div> : null}
			{errorMessage ? <p role="alert">{errorMessage}</p> : null}

			<div className={styles.faq}>
				<Heading level={2} text="Frequently asked questions" bg="bg" />
				<div>
					<details className={styles.question}>
						<summary className={styles.summary}>
							What happens to my links if I downgrade to the free plan?
							<Icon.ChevronDown />
						</summary>
						<p>
							We never remove your links. Everything you've saved stays in your
							account. If you're over the free plan's limit, adding new links is
							paused until you delete some or upgrade again.
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							Will my shared collections stay online if I cancel Unlimited?
							<Icon.ChevronDown />
						</summary>
						<p>
							Sharing is part of Unlimited, so after a downgrade those pages go
							offline and show "not found". We keep everything, including
							addresses and passwords, so upgrading again restores them without
							you changing anything.
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							Can I cancel any time?
							<Icon.ChevronDown />
						</summary>
						<p>
							Yes, in Settings: choose Manage next to your account type. You keep
							Unlimited until the end of the period you've paid for.
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							Do you offer refunds?
							<Icon.ChevronDown />
						</summary>
						<p>
							No, we don't offer refunds. The free plan is generous, so give it a
							proper try first. If you're still unsure, start with a single month
							of Unlimited and switch to yearly once you're sure you love it.
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							Can I import and export my data?
							<Icon.ChevronDown />
						</summary>
						<p>
							Yes. Bringing your existing bookmarks from popular browsers and
							other bookmarking services takes just a few clicks. Getting it out
							is just as easy: your data is yours, so you can export it at any
							time.
						</p>
					</details>
					<details className={styles.question}>
						<summary className={styles.summary}>
							What happens when I delete my account?
							<Icon.ChevronDown />
						</summary>
						<p>
							Deleting your account takes only a moment. We don't just hide
							deleted accounts: everything associated with yours is permanently
							removed, and any active subscription is cancelled straight away.
						</p>
					</details>
				</div>
			</div>
		</section>
	);
}

export default Pricing;
