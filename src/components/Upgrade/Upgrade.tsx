import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";

import { countryQueryOptions } from "#/queries/country.ts";
import { getLocalPrice } from "#/utils/getLocalPrice.ts";

import ButtonLinkLike from "../ButtonLinkLike/ButtonLinkLike.tsx";

import styles from "./Upgrade.module.css";

function Upgrade({ returnTo }: { returnTo: "dashboard" | "settings" }) {
	const queryClient = useQueryClient();
	const { data: country } = useSuspenseQuery(countryQueryOptions);
	const [upgradeError, setUpgradeError] = useState<string | null>(null);

	const createCheckout = useMutation({
		mutationFn: async () => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/subscriptions/checkout`,
				{
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ returnTo }),
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
			setUpgradeError("We couldn't start the upgrade. Please try again.");
		},
	});
	const isRedirecting = createCheckout.isPending || createCheckout.isSuccess;

	return (
		<div className={styles.wrapper}>
			<p>
				<ButtonLinkLike
					type="button"
					disabled={isRedirecting}
					onClick={() => {
						setUpgradeError(null);
						createCheckout.mutate();
					}}
					text="Upgrade to Unlimited"
				/>{" "}
				for public and password-protected collections, and no caps on links,
				tags or collections. {getLocalPrice(30, country)} a year or{" "}
				{getLocalPrice(3, country)} a month. Most importantly, you'll support an
				indie project built out of love for the web.
			</p>

			{upgradeError ? <p role="alert">{upgradeError}</p> : null}
		</div>
	);
}

export default Upgrade;
