import { useState } from "react";
import type { User } from "#/queries/me.ts";
import {
	DashboardButtonAction,
	Dialog,
	FormDisplayName,
	FormEmail,
	FormPassword,
	FormUsername,
} from "..";
import styles from "./SettingsList.module.css";

function SettingsListAccount({ user }: { user: User }) {
	const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
	const [isChangeDisplayNameOpen, setIsChangeDisplayNameOpen] = useState(false);
	const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
	const [changeEmailKey, setChangeEmailKey] = useState(0);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	return (
		<>
			<dl className={styles.list}>
				<div className={styles.item}>
					<dt className={styles.term}>Display name</dt>
					<dd className={styles.row}>
						<span className={styles.value}>{user.displayName}</span>
						<span className={styles.action}>
							<DashboardButtonAction
								onClick={() => setIsChangeDisplayNameOpen(true)}
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
								onClick={() => setIsChangeUsernameOpen(true)}
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
									setChangeEmailKey((key) => key + 1);
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
								onClick={() => setIsChangePasswordOpen(true)}
								text="Change password"
							/>
						</span>
					</dd>
				</div>
			</dl>

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
				<FormEmail
					key={changeEmailKey}
					onClose={() => setIsChangeEmailOpen(false)}
				/>
			</Dialog>

			<Dialog
				open={isChangePasswordOpen}
				onClose={() => setIsChangePasswordOpen(false)}
				title="Change password"
			>
				<FormPassword onClose={() => setIsChangePasswordOpen(false)} />
			</Dialog>
		</>
	);
}

export default SettingsListAccount;
