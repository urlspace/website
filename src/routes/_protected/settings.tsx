import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Button,
  DashboardButtonAction,
  DashboardButtonLink,
  DashboardLogo,
  Dialog,
  FormDeleteAccount,
  FormDisplayName,
  FormEmail,
  FormPassword,
  FormToken,
  FormUsername,
  Heading,
  Icon,
  SessionsList,
  Stack,
  TokensList,
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

  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isChangeDisplayNameOpen, setIsChangeDisplayNameOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [changeEmailKey, setChangeEmailKey] = useState(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
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

            <dl className="settings">
              <div className="settings__item">
                <dt className="settings__term">Display name</dt>
                <dd className="settings__row">
                  <span className="settings__value">{user.displayName}</span>
                  <span className="settings__action">
                    <DashboardButtonAction
                      onClick={() => setIsChangeDisplayNameOpen(true)}
                      text="Change display name"
                    />
                  </span>
                </dd>
              </div>

              <div className="settings__item">
                <dt className="settings__term">Username</dt>
                <dd className="settings__row">
                  <span className="settings__value">{user.username}</span>
                  <span className="settings__action">
                    <DashboardButtonAction
                      onClick={() => setIsChangeUsernameOpen(true)}
                      text="Change username"
                    />
                  </span>
                </dd>
              </div>

              <div className="settings__item">
                <dt className="settings__term">Email</dt>
                <dd className="settings__row">
                  <span className="settings__value">{user.email}</span>
                  <span className="settings__action">
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

              <div className="settings__item">
                <dt className="settings__term">Password</dt>
                <dd className="settings__row">
                  <span className="settings__value">
                    <span aria-hidden="true">•••••••••••••••</span>
                    <span className="visually-hidden">Password is set</span>
                  </span>
                  <span className="settings__action">
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
            <Heading level={2} text="API Tokens" />
            <p>
              Access tokens let another app use your url.space account without
              knowing your password. Most people do not need one. Only create a
              token when a trusted app asks for it, and remove it when you no
              longer use that app.
            </p>
            <TokensList />
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
            <SessionsList />
          </Stack>

          <hr />

          <Stack gap={1}>
            <Heading level={2} text="Delete your account" />
            <p>
              You can permanently delete your account at any time. If you would
              like to tell us why you are leaving, email{" "}
              <a href="mailto:mail@url.space">mail@url.space</a>. Sharing feedback
              is optional.
            </p>
            <Button
              onClick={() => setIsDeleteAccountOpen(true)}
              text="Delete your account"
            />
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
