import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	Button,
	DashboardButtonLink,
	DashboardLogo,
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
import { tokensQueryOptions } from "#/queries/tokens.ts";

export const Route = createFileRoute("/_protected/settings")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(meQueryOptions),
			context.queryClient.ensureQueryData(sessionsQueryOptions),
			context.queryClient.ensureQueryData(tokensQueryOptions),
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
	const { data: user } = useSuspenseQuery(meQueryOptions);

	const [isCreateTokenOpen, setIsCreateTokenOpen] = useState(false);
	const [createTokenKey, setCreateTokenKey] = useState(0);
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

	if (!user) return null;

	return (
		<div className="page">
			<header className="page__header">
				<DashboardLogo />
				<DashboardButtonLink
					icon={<Icon.Dashboard />}
					to="/dashboard"
					text="Back to dashboard"
				/>
			</header>
			<main className="page__main">
				<Stack gap={2}>
					<Heading level={1} text="Settings" />

					<Stack gap={1}>
						<Heading level={2} text="Account details" />
						<SettingsListAccount user={user} />
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="API Tokens" />
						<p>
							Access tokens let another app use your url.space account without
							knowing your password. Most people do not need one. Only create a
							token when a trusted app asks for it, and remove it when you no
							longer use that app.
						</p>
						<SettingsListTokens />
						<Button
							onClick={() => {
								setCreateTokenKey((k) => k + 1);
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
							You can permanently delete your account at any time. If you would
							like to tell us why you are leaving, email{" "}
							<a href="mailto:mail@url.space">mail@url.space</a>. Sharing
							feedback is optional.
						</p>
						<Button
							onClick={() => setIsDeleteAccountOpen(true)}
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
				<FormToken
					key={createTokenKey}
					onClose={() => setIsCreateTokenOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isDeleteAccountOpen}
				onClose={() => setIsDeleteAccountOpen(false)}
				title="Delete your account"
			>
				<FormDeleteAccount onClose={() => setIsDeleteAccountOpen(false)} />
			</Dialog>
		</div>
	);
}
