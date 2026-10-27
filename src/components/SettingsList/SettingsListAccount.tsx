import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";

import type { User } from "#/queries/me.ts";
import {
	type SubscriptionRow,
	subscriptionsQueryOptions,
} from "#/queries/subscriptions.ts";
import { formatDate } from "#/utils.ts";

import {
	DashboardButtonAction,
	Dialog,
	FormDisplayName,
	FormEmail,
	FormPassword,
	FormUsername,
} from "..";

import styles from "./SettingsList.module.css";

function getAccountType(
	isAdmin: boolean,
	isPro: boolean,
	activeSubscription: SubscriptionRow | undefined,
) {
	if (isAdmin) {
		return "Admin";
	}
	if (!isPro) {
		return "Free";
	}
	if (!activeSubscription) {
		return "Pro";
	}
	if (activeSubscription.status === "past_due") {
		return "Pro (payment failed)";
	}
	if (activeSubscription.cancelAtPeriodEnd) {
		return `Pro, valid until ${formatDate(activeSubscription.currentPeriodEnd)}`;
	}
	return `Pro, renews on ${formatDate(activeSubscription.currentPeriodEnd)}`;
}

function SettingsListAccount({
	user,
	isCheckoutCompleted,
}: {
	user: User;
	isCheckoutCompleted: boolean;
}) {
	const queryClient = useQueryClient();
	const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions);
	const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
	const [isChangeDisplayNameOpen, setIsChangeDisplayNameOpen] = useState(false);
	const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isPro = user.isPro || isCheckoutCompleted;
	const activeSubscription = subscriptions.find(
		(subscription) => subscription.isActive,
	);

	const createCheckout = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/subscriptions/checkout`,
				{
					method: "POST",
					credentials: "include",
				},
			);
			// Reload so the route guard can clear the invalid session and cached data.
			if (
				res.status === 401 &&
				((await res.clone().json()) as { data: string }).data === "unauthorized"
			) {
				window.location.reload();
				throw new Error("Session expired.");
			}

			if (res.status === 409) {
				return null;
			}

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

	const createPortal = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/subscriptions/portal`,
				{
					method: "POST",
					credentials: "include",
				},
			);
			// Reload so the route guard can clear the invalid session and cached data.
			if (
				res.status === 401 &&
				((await res.clone().json()) as { data: string }).data === "unauthorized"
			) {
				window.location.reload();
				throw new Error("Session expired.");
			}

			if (!res.ok) throw new Error(`create portal failed: ${res.status}`);

			const json = (await res.json()) as { data: { url: string } };
			return json.data.url;
		},
		onSuccess: (url) => {
			window.location.assign(url);
		},
		onError: () => {
			setErrorMessage(
				"We couldn't open subscription management. Please try again.",
			);
		},
	});

	return (
		<>
			{errorMessage ? (
				<p role="alert" className={styles.error}>
					{errorMessage}
				</p>
			) : null}

			<dl className={styles.list}>
				<div className={styles.item}>
					<dt className={styles.term}>Display name</dt>
					<dd className={styles.row}>
						<span className={styles.value}>{user.displayName}</span>
						<span className={styles.action}>
							<DashboardButtonAction
								onClick={() => {
									setFormKey((key) => key + 1);
									setIsChangeDisplayNameOpen(true);
								}}
								text="Change display name"
							/>
						</span>
					</dd>
				</div>

				<div className={styles.item}>
					<dt className={styles.term}>Username</dt>
					<dd className={styles.row}>
						<span className={styles.value}>{user.username}</span>
						<span className={styles.action}>
							<DashboardButtonAction
								onClick={() => {
									setFormKey((key) => key + 1);
									setIsChangeUsernameOpen(true);
								}}
								text="Change username"
							/>
						</span>
					</dd>
				</div>

				<div className={styles.item}>
					<dt className={styles.term}>Email</dt>
					<dd className={styles.row}>
						<span className={styles.value}>{user.email}</span>
						<span className={styles.action}>
							<DashboardButtonAction
								onClick={() => {
									setFormKey((key) => key + 1);
									setIsChangeEmailOpen(true);
								}}
								text="Change email"
							/>
						</span>
					</dd>
				</div>

				<div className={styles.item}>
					<dt className={styles.term}>Password</dt>
					<dd className={styles.row}>
						<span className={styles.value}>
							<span aria-hidden="true">•••••••••••••••</span>
							<span className="visually-hidden">Password is set</span>
						</span>
						<span className={styles.action}>
							<DashboardButtonAction
								onClick={() => {
									setFormKey((key) => key + 1);
									setIsChangePasswordOpen(true);
								}}
								text="Change password"
							/>
						</span>
					</dd>
				</div>

				<div className={styles.item}>
					<dt className={styles.term}>Account type</dt>
					<dd className={styles.row}>
						<span className={styles.value}>
							{getAccountType(user.isAdmin, isPro, activeSubscription)}
						</span>
						{user.isAdmin ? null : isPro ? (
							activeSubscription || isCheckoutCompleted ? (
								<span className={styles.action}>
									<DashboardButtonAction
										ariaLabel="Manage subscription"
										disabled={createPortal.isPending || createPortal.isSuccess}
										onClick={() => {
											setErrorMessage(null);
											createPortal.mutate();
										}}
										text={
											createPortal.isPending || createPortal.isSuccess
												? "Redirecting..."
												: "Manage"
										}
									/>
								</span>
							) : null
						) : (
							<span className={styles.action}>
								<DashboardButtonAction
									disabled={
										createCheckout.isPending || createCheckout.isSuccess
									}
									onClick={() => {
										setErrorMessage(null);
										createCheckout.mutate();
									}}
									text={
										createCheckout.isPending || createCheckout.isSuccess
											? "Redirecting..."
											: "Upgrade account"
									}
								/>
							</span>
						)}
					</dd>
				</div>

				{!isPro && !user.isAdmin && user.stats.linksLimit !== null ? (
					<div className={styles.item}>
						<dt className={styles.term}>Links limit</dt>
						<dd className={styles.row}>
							<span className={styles.value}>
								{`${user.stats.linksCount}/${user.stats.linksLimit}`}
							</span>
						</dd>
					</div>
				) : null}

				{!isPro && !user.isAdmin && user.stats.collectionsLimit !== null ? (
					<div className={styles.item}>
						<dt className={styles.term}>Collections limit</dt>
						<dd className={styles.row}>
							<span className={styles.value}>
								{`${user.stats.collectionsCount}/${user.stats.collectionsLimit}`}
							</span>
						</dd>
					</div>
				) : null}

				{!isPro && !user.isAdmin && user.stats.tagsLimit !== null ? (
					<div className={styles.item}>
						<dt className={styles.term}>Tags limit</dt>
						<dd className={styles.row}>
							<span className={styles.value}>
								{`${user.stats.tagsCount}/${user.stats.tagsLimit}`}
							</span>
						</dd>
					</div>
				) : null}
			</dl>

			<Dialog
				open={isChangeUsernameOpen}
				onClose={() => setIsChangeUsernameOpen(false)}
				title="Change username"
			>
				<FormUsername
					key={formKey}
					username={user.username}
					isPro={user.isPro}
					isAdmin={user.isAdmin}
					onClose={() => setIsChangeUsernameOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isChangeDisplayNameOpen}
				onClose={() => setIsChangeDisplayNameOpen(false)}
				title="Change display name"
			>
				<FormDisplayName
					key={formKey}
					displayName={user.displayName}
					onClose={() => setIsChangeDisplayNameOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isChangeEmailOpen}
				onClose={() => setIsChangeEmailOpen(false)}
				title="Change email"
			>
				<FormEmail key={formKey} onClose={() => setIsChangeEmailOpen(false)} />
			</Dialog>

			<Dialog
				open={isChangePasswordOpen}
				onClose={() => setIsChangePasswordOpen(false)}
				title="Change password"
			>
				<FormPassword
					key={formKey}
					onClose={() => setIsChangePasswordOpen(false)}
				/>
			</Dialog>
		</>
	);
}

export default SettingsListAccount;
