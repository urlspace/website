import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { tokensQueryKey, tokensQueryOptions } from "#/queries/tokens.ts";
import { DashboardButtonAction } from "..";

function TokensList() {
	const queryClient = useQueryClient();
	const { data: tokens } = useSuspenseQuery(tokensQueryOptions);

	const deleteToken = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/tokens/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error(`delete token failed: ${res.status}`);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: tokensQueryKey }),
	});

	return (
		<ul className="settingsList">
			{tokens.length === 0 ? (
				<li className="settingsList__item">
					<span className="settingsList__name">No API tokens.</span>
				</li>
			) : null}
			{tokens.map((token) => (
				<li className="settingsList__item" key={token.id}>
					<span className="settingsList__name">{token.description}</span>
					<span className="settingsList__action">
						<DashboardButtonAction
							onClick={() => deleteToken.mutate(token.id)}
							text={
								deleteToken.isPending && deleteToken.variables === token.id
									? "Deleting..."
									: "Delete token"
							}
							destructive
						/>
					</span>
				</li>
			))}
		</ul>
	);
}

export default TokensList;
