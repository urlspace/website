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
  });

  return (
    <>
      <ul className="settingsList">
        {sessions.length === 0 ? (
          <li className="settingsList__item">
            <span className="settingsList__name">No active sessions.</span>
          </li>
        ) : null}
        {sessions.map((session) => (
          <li className="settingsList__item" key={session.id}>
            <span className="settingsList__name">
              {session.current ? "Current session: " : null}
              {session.description ?? "Unknown device"}
            </span>
            <span className="settingsList__action">
              <DashboardButtonAction
                onClick={() =>
                  session.current
                    ? setRevokeCurrentSessionId(session.id)
                    : deleteSession.mutate({ id: session.id, isCurrent: false })
                }
                text={
                  deleteSession.isPending &&
                  deleteSession.variables?.id === session.id
                    ? "Revoking..."
                    : "Revoke session"
                }
                destructive
              />
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => setIsDeleteAllOpen(true)}
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
