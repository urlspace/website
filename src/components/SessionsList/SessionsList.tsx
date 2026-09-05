import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { sessionsQueryKey, sessionsQueryOptions } from "#/queries/sessions.ts";
import { Button, DashboardButtonAction, Dialog, Stack } from "..";

function SessionsList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: sessions } = useSuspenseQuery(sessionsQueryOptions);

  const [revokeCurrentSessionId, setRevokeCurrentSessionId] = useState<
    string | null
  >(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSelfLogoutSuccess() {
    queryClient.clear();
    await router.invalidate();
    await router.navigate({ to: "/auth/signin" });
  }

  const deleteSession = useMutation({
    mutationFn: async ({ id }: { id: string; isCurrent: boolean }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/sessions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error(`delete session failed: ${res.status}`);
    },
    onSuccess: (_data, variables) => {
      if (variables.isCurrent) {
        setRevokeCurrentSessionId(null);
        void handleSelfLogoutSuccess();
      } else {
        queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      }
    },
    onError: (_error, variables) => {
      if (variables.isCurrent) {
        setRevokeCurrentSessionId(null);
        setErrorMessage("We couldn't sign you out. Please try again.");
      } else {
        setErrorMessage("We couldn't sign out that device. Please try again.");
      }
    },
  });

  const deleteAllSessions = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`delete all sessions failed: ${res.status}`);
    },
    onSuccess: () => {
      setIsDeleteAllOpen(false);
      void handleSelfLogoutSuccess();
    },
    onError: () => {
      setIsDeleteAllOpen(false);
      setErrorMessage("We couldn't sign out on all devices. Please try again.");
    },
  });

  return (
    <>
      {errorMessage ? (
        <p role="alert" className="settings__error">
          {errorMessage}
        </p>
      ) : null}

      <ul className="settings" role="list">
        {sessions.length === 0 ? (
          <li className="settings__item">
            <span className="settings__name">No active sessions.</span>
          </li>
        ) : null}
        {sessions.map((session) => (
          <li key={session.id} className="settings__item">
            <div className="settings__row">
              <span className="settings__value">
                {session.description ?? "Unknown device"}
                {session.current ? ", current device" : ""}
              </span>
              <span className="settings__action">
                <DashboardButtonAction
                  ariaLabel={`Revoke session: ${
                    session.description ?? "Unknown device"
                  }`}
                  onClick={() => {
                    setErrorMessage(null);
                    if (session.current) {
                      setRevokeCurrentSessionId(session.id);
                    } else {
                      deleteSession.mutate({
                        id: session.id,
                        isCurrent: false,
                      });
                    }
                  }}
                  text={
                    deleteSession.isPending &&
                    deleteSession.variables?.id === session.id
                      ? "Revoking..."
                      : "Revoke session"
                  }
                  destructive
                />
              </span>
            </div>
            <dl className="settings__details">
              <div className="settings__detail">
                <dt className="settings__prop">Signed in</dt>
                <dd className="settings__propvalue">
                  <time dateTime={session.createdAt}>
                    {session.createdAt.slice(0, 10).replaceAll("-", ".")}
                  </time>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => {
          setErrorMessage(null);
          setIsDeleteAllOpen(true);
        }}
        text="Delete all sessions and sign out"
      />

      <Dialog
        open={revokeCurrentSessionId !== null}
        onClose={() => setRevokeCurrentSessionId(null)}
        title="Revoke this session?"
      >
        <Stack>
          <p>
            This is your current session. Revoking it will sign you out
            immediately.
          </p>
          <Button
            text={
              deleteSession.isPending ? "Revoking..." : "Revoke and sign out"
            }
            onClick={() => {
              if (revokeCurrentSessionId) {
                deleteSession.mutate({
                  id: revokeCurrentSessionId,
                  isCurrent: true,
                });
              }
            }}
          />
        </Stack>
      </Dialog>

      <Dialog
        open={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        title="Delete all sessions?"
      >
        <Stack>
          <p>This will sign you out of every device, including this one.</p>
          <Button
            text={
              deleteAllSessions.isPending
                ? "Deleting..."
                : "Delete all and sign out"
            }
            onClick={() => deleteAllSessions.mutate()}
          />
        </Stack>
      </Dialog>
    </>
  );
}

export default SessionsList;
