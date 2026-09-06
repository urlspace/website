import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { tokensQueryKey, tokensQueryOptions } from "#/queries/tokens.ts";
import { formatDate } from "#/utils.ts";
import { Button, DashboardButtonAction, Dialog, Stack } from "..";
import styles from "./SettingsList.module.css";

function SettingsListTokens() {
	const queryClient = useQueryClient();
	const { data: tokens } = useSuspenseQuery(tokensQueryOptions);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [tokenToRevoke, setTokenToRevoke] = useState<{
		id: string;
		description: string;
	} | null>(null);

	const revokeToken = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/tokens/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error(`revoke token failed: ${res.status}`);
		},
		onSuccess: () => {
			setTokenToRevoke(null);
			queryClient.invalidateQueries({ queryKey: tokensQueryKey });
		},
		onError: () => {
			setTokenToRevoke(null);
			setErrorMessage("We couldn't revoke that token. Please try again.");
		},
	});

	return (
		<>
			{errorMessage ? (
				<p role="alert" className={styles.error}>
					{errorMessage}
				</p>
			) : null}

			{/* biome-ignore lint/a11y/noRedundantRoles: preserve semantics when CSS removes list markers */}
			<ul className={styles.list} role="list">
				{tokens.length === 0 ? (
					<li className={styles.item}>
						<span className={styles.value}>No access tokens.</span>
					</li>
				) : null}
				{tokens.map((token) => (
					<li className={styles.item} key={token.id}>
						<div className={styles.row}>
							<span className={`${styles.value} ${styles.valueToken}`}>
								<span aria-hidden="true">{`urlspace_${"•".repeat(8)}${token.tokenSuffix ? token.tokenSuffix : "•".repeat(6)}`}</span>
								<span className="visually-hidden">
									{token.tokenSuffix
										? `Token ending in ${token.tokenSuffix}`
										: "Token value hidden"}
								</span>
							</span>
							<span className={styles.action}>
								<DashboardButtonAction
									ariaLabel={`Revoke token: ${token.description}`}
									onClick={() => {
										setErrorMessage(null);
										setTokenToRevoke({
											id: token.id,
											description: token.description,
										});
									}}
									text="Revoke token"
									destructive
								/>
							</span>
						</div>
						<dl className={styles.details}>
							<div className={styles.detail}>
								<dt className={styles.prop}>Description</dt>
								<dd className={styles.propvalue}>{token.description}</dd>
							</div>
							<div className={styles.detail}>
								<dt className={styles.prop}>Created</dt>
								<dd className={styles.propvalue}>
									<time dateTime={token.createdAt}>
										{formatDate(token.createdAt)}
									</time>
								</dd>
							</div>
							<div className={styles.detail}>
								<dt className={styles.prop}>Last used</dt>
								<dd className={styles.propvalue}>
									{token.lastUsedAt === token.createdAt ? (
										"Never"
									) : (
										<time dateTime={token.lastUsedAt}>
											{formatDate(token.lastUsedAt)}
										</time>
									)}
								</dd>
							</div>
						</dl>
					</li>
				))}
			</ul>

			<Dialog
				open={tokenToRevoke !== null}
				onClose={() => setTokenToRevoke(null)}
				title="Revoke token?"
			>
				{tokenToRevoke ? (
					<Stack>
						<p>
							Revoking <strong>{tokenToRevoke.description}</strong> will
							immediately prevent apps and scripts using it from accessing your
							account. This cannot be undone.
						</p>
						<Button
							disabled={revokeToken.isPending}
							onClick={() => revokeToken.mutate(tokenToRevoke.id)}
							text={revokeToken.isPending ? "Revoking..." : "Revoke token"}
						/>
					</Stack>
				) : null}
			</Dialog>
		</>
	);
}

export default SettingsListTokens;
