import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	Button,
	DashboardButtonAction,
	DashboardButtonLink,
	DashboardLogo,
	Dialog,
	FormDisplayName,
	FormEmail,
	FormUsername,
	Heading,
	Icon,
	Stack,
} from "#/components/index.ts";
import { meQueryOptions } from "#/queries/me.ts";

export const Route = createFileRoute("/_protected/settings")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(meQueryOptions);
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

	const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
	const [isChangeDisplayNameOpen, setIsChangeDisplayNameOpen] = useState(false);
	const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

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
						<Heading level={2} text="Profile" />

						<dl className="settings">
							<div>
								<dt>Display name</dt>
								<dd className="settingsList__item">
									<span className="settingsList__name">{user.displayName}</span>
									<span className="settingsList__action">
										<DashboardButtonAction
											onClick={() => setIsChangeDisplayNameOpen(true)}
											text="Change display name"
										/>
									</span>
								</dd>
							</div>

							<div>
								<dt>Username</dt>
								<dd className="settingsList__item">
									<span className="settingsList__name">{user.username}</span>
									<span className="settingsList__action">
										<DashboardButtonAction
											onClick={() => setIsChangeUsernameOpen(true)}
											text="Change username"
										/>
									</span>
								</dd>
							</div>

							<div>
								<dt>Email</dt>
								<dd className="settingsList__item">
									<span className="settingsList__name">{user.email}</span>
									<span className="settingsList__action">
										<DashboardButtonAction
											onClick={() => setIsChangeEmailOpen(true)}
											text="Change email"
										/>
									</span>
								</dd>
							</div>
						</dl>
					</Stack>
					<hr />
					<Stack gap={1}>
						<Heading level={2} text="Security" />
						<dl className="settings">
							<div>
								<dt>Password</dt>
								<dd className="settingsList__item">
									<span className="settingsList__name">************</span>
									<span className="settingsList__action">
										<DashboardButtonAction
											onClick={() => setIsChangePasswordOpen(true)}
											text="Change password"
										/>
									</span>
								</dd>
							</div>
						</dl>
					</Stack>

					<hr />
					<Stack gap={1}>
						<Heading level={2} text="Sessions" />
						<ul className="settingsList">
							<li className="settingsList__item">
								<span className="settingsList__name">Session name</span>
								<span className="settingsList__action">
									<DashboardButtonAction
										onClick={() => setIsChangeUsernameOpen(true)}
										text="Revoke session"
									/>
								</span>
							</li>
							<li className="settingsList__item">
								<span className="settingsList__name">
									Lorem ipsum dolor sit amet consectetur, adipisicing elit.
									Doloremque? Lorem ipsum dolor sit amet.
								</span>
								<span className="settingsList__action">
									<DashboardButtonAction
										onClick={() => setIsChangeUsernameOpen(true)}
										text="Revoke session"
									/>
								</span>
							</li>
						</ul>

						<Button text="Delete all sessions" />
					</Stack>

					<hr />
					<Stack gap={1}>
						<Heading level={2} text="API Tokens" />
						<ul className="settingsList">
							<li className="settingsList__item">
								<span className="settingsList__name">Token name</span>
								<span className="settingsList__action">
									<DashboardButtonAction
										onClick={() => setIsChangeUsernameOpen(true)}
										text="Delete token"
									/>
								</span>
							</li>
							<li className="settingsList__item">
								<span className="settingsList__name">
									Lorem ipsum dolor sit amet consectetur, adipisicing elit.
									Doloremque? Lorem ipsum dolor sit amet.
								</span>
								<span className="settingsList__action">
									<DashboardButtonAction
										onClick={() => setIsChangeUsernameOpen(true)}
										text="Delete token"
									/>
								</span>
							</li>
						</ul>
						<Button text="Delete all tokens" />
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="Delete your account" />
						<p>
							Deleting an account should be as easy as creating one, and we are
							not going to stop you. We would appreciate if you could drop us a
							line at <a href="mailto:mail@url.space">mail@url.space</a> and
							share your rason please.
						</p>
						<Button text="Delete your account" />
					</Stack>
				</Stack>
			</main>

			<Dialog
				open={isChangeUsernameOpen}
				onClose={() => setIsChangeUsernameOpen(false)}
				title="Change username"
			>
				<FormUsername
					username={user.username}
					onClose={() => setIsChangeUsernameOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isChangeDisplayNameOpen}
				onClose={() => setIsChangeDisplayNameOpen(false)}
				title="Change display name"
			>
				<FormDisplayName
					displayName={user.displayName}
					onClose={() => setIsChangeDisplayNameOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isChangeEmailOpen}
				onClose={() => setIsChangeEmailOpen(false)}
				title="Change email"
			>
				<FormEmail onClose={() => setIsChangeEmailOpen(false)} />
			</Dialog>

			<Dialog
				open={isChangePasswordOpen}
				onClose={() => setIsChangePasswordOpen(false)}
				title="Change password"
			>
				change password
			</Dialog>
		</div>
	);
}
