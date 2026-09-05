import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { tokensQueryKey, tokensQueryOptions } from "#/queries/tokens.ts";
import { formatDate } from "#/utils.ts";
import { Button, DashboardButtonAction, Dialog, Stack } from "..";

function TokensList() {
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
        <p role="alert" className="settings__error">
          {errorMessage}
        </p>
      ) : null}

      {/* biome-ignore lint/a11y/noRedundantRoles: preserve semantics when CSS removes list markers */}
      <ul className="settings" role="list">
        {tokens.length === 0 ? (
          <li className="settings__item">
            <span className="settingsList__name">No API tokens.</span>
          </li>
        ) : null}
        {tokens.map((token) => (
          <li className="settings__item" key={token.id}>
            <div className="settings__row">
              <span className="settings__value settings__value--token">
                <span aria-hidden="true">{`urlspace_${"•".repeat(8)}${token.tokenSuffix ? token.tokenSuffix : "•".repeat(6)}`}</span>
                <span className="visually-hidden">
                  {token.tokenSuffix
                    ? `Token ending in ${token.tokenSuffix}`
                    : "Token value hidden"}
                </span>
              </span>
              <span className="settings__action">
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
            <dl className="settings__details">
              <div className="settings__detail">
                <dt className="settings__prop">Description</dt>
                <dd className="settings__propvalue">{token.description}</dd>
              </div>
              <div className="settings__detail">
                <dt className="settings__prop">Created</dt>
                <dd className="settings__propvalue">
                  <time dateTime={token.createdAt}>
                    {formatDate(token.createdAt)}
                  </time>
                </dd>
              </div>
              <div className="settings__detail">
                <dt className="settings__prop">Last used</dt>
                <dd className="settings__propvalue">
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

export default TokensList;
