import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
	Button,
	DashboardButtonLink,
	Logo,
	Dialog,
	FormDeleteAccount,
	FormToken,
	Heading,
	Icon,
	SettingsListAccount,
	SettingsListSessions,
	SettingsListTokens,
	Stack,
} from "#/components/index.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { sessionsQueryOptions } from "#/queries/sessions.ts";
import {
	subscriptionsQueryKey,
	subscriptionsQueryOptions,
} from "#/queries/subscriptions.ts";
import { tokensQueryOptions } from "#/queries/tokens.ts";

export const Route = createFileRoute("/_protected/settings")({
	validateSearch: (
		search: Record<string, unknown>,
	): { payment?: "processing" } => ({
		payment: search.payment === "processing" ? "processing" : undefined,
	}),
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.query({ ...meQueryOptions, staleTime: "static" }),
			context.queryClient.query({
				...sessionsQueryOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...subscriptionsQueryOptions,
				staleTime: "static",
			}),
			context.queryClient.query({ ...tokensQueryOptions, staleTime: "static" }),
		]);
	},
	component: PageProfile,
	head: () => ({
		meta: [
			{
				title: "Settings | url.space",
			},
		],
	}),
});

function PageProfile() {
	const queryClient = useQueryClient();
	const navigate = Route.useNavigate();
	const { payment } = Route.useSearch();
	const { data: user } = useSuspenseQuery({
		...meQueryOptions,
		refetchInterval: payment === "processing" ? 2000 : false,
	});
	const isPaymentProcessing = payment === "processing" && !user.isPro;

	useEffect(() => {
		if (payment === "processing" && user.isPro) {
			void queryClient.invalidateQueries({ queryKey: subscriptionsQueryKey });
			void navigate({ search: {}, replace: true });
		}
	}, [payment, user.isPro, queryClient, navigate]);

	const [isCreateTokenOpen, setIsCreateTokenOpen] = useState(false);
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
	const [formKey, setFormKey] = useState(0);

	return (
		<div className="page">
			<header className="page__header">
				<Logo to="/dashboard" />
				<DashboardButtonLink
					icon={<Icon.Back />}
					to="/dashboard"
					text="Back to dashboard"
				/>
			</header>
			<main className="page__main">
				<Stack gap={2}>
					<Heading level={1} text="Settings" />

					<Stack gap={1}>
						<Heading level={2} text="Account details" />
						<SettingsListAccount
							user={user}
							isPaymentProcessing={isPaymentProcessing}
						/>
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="Access tokens" />
						<p>
							Access tokens let another app use your url.space account without
							knowing your password. Most people do not need one. Only create a
							token when a trusted app asks for it, and remove it when you no
							longer use that app.
						</p>
						<SettingsListTokens />
						<Button
							onClick={() => {
								setFormKey((key) => key + 1);
								setIsCreateTokenOpen(true);
							}}
							text="Create token"
						/>
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="Signed-in devices" />
						<p>
							These are the devices and browsers currently signed in to your
							account. If you spot one you don't recognise, sign it out below.
						</p>
						<SettingsListSessions />
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="Delete your account" />
						<p>
							Deleting your account is permanent and cannot be undone. If you
							would like to tell us why you are leaving, email{" "}
							<a href="mailto:mail@url.space">mail@url.space</a>. Sharing
							feedback is optional.
						</p>
						<Button
							onClick={() => {
								setFormKey((key) => key + 1);
								setIsDeleteAccountOpen(true);
							}}
							text="Delete your account"
						/>
					</Stack>
				</Stack>
			</main>

			<Dialog
				open={isCreateTokenOpen}
				onClose={() => setIsCreateTokenOpen(false)}
				title="Create token"
			>
				<FormToken key={formKey} />
			</Dialog>

			<Dialog
				open={isDeleteAccountOpen}
				onClose={() => setIsDeleteAccountOpen(false)}
				title="Delete your account"
			>
				<FormDeleteAccount
					key={formKey}
					isPro={user.isPro}
					onClose={() => setIsDeleteAccountOpen(false)}
				/>
			</Dialog>
		</div>
	);
}
