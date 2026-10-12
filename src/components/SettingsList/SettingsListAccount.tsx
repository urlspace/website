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
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <dl className={styles.list}>
        <div className={styles.item}>
          <dt className={styles.term}>Display name</dt>
          <dd className={styles.row}>
            <span className={styles.value}>{user.displayName}</span>
            <span className={styles.action}>
              <DashboardButtonAction
                onClick={() => {
                  setFormKey((key) => key + 1);
                  setIsChangeDisplayNameOpen(true);
                }}
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
                onClick={() => {
                  setFormKey((key) => key + 1);
                  setIsChangeUsernameOpen(true);
                }}
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
                  setFormKey((key) => key + 1);
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
                onClick={() => {
                  setFormKey((key) => key + 1);
                  setIsChangePasswordOpen(true);
                }}
                text="Change password"
              />
            </span>
          </dd>
        </div>

        <div className={styles.item}>
          <dt className={styles.term}>Account type</dt>
          <dd className={styles.row}>
            <span className={styles.value}>
              {user.isAdmin ? "Admin" : user.isPro ? "Pro" : "Free"}
            </span>
            {user.isAdmin ? null : (
              <span className={styles.action}>
                <DashboardButtonAction
                  onClick={() => {}}
                  text={user.isPro ? "Downgrade account" : "Upgrade account"}
                />
              </span>
            )}
          </dd>
        </div>

        {user.stats.linksLimit !== null ? (
          <div className={styles.item}>
            <dt className={styles.term}>Links limit</dt>
            <dd className={styles.row}>
              <span className={styles.value}>
                {`${user.stats.linksCount}/${user.stats.linksLimit}`}
              </span>
            </dd>
          </div>
        ) : null}

        {user.stats.collectionsLimit !== null ? (
          <div className={styles.item}>
            <dt className={styles.term}>Collections limit</dt>
            <dd className={styles.row}>
              <span className={styles.value}>
                {`${user.stats.collectionsCount}/${user.stats.collectionsLimit}`}
              </span>
            </dd>
          </div>
        ) : null}

        {user.stats.tagsLimit !== null ? (
          <div className={styles.item}>
            <dt className={styles.term}>Tags limit</dt>
            <dd className={styles.row}>
              <span className={styles.value}>
                {`${user.stats.tagsCount}/${user.stats.tagsLimit}`}
              </span>
            </dd>
          </div>
        ) : null}
      </dl>

      <Dialog
        open={isChangeUsernameOpen}
        onClose={() => setIsChangeUsernameOpen(false)}
        title="Change username"
      >
        <FormUsername
          key={formKey}
          username={user.username}
          isPro={user.isPro}
          isAdmin={user.isAdmin}
          onClose={() => setIsChangeUsernameOpen(false)}
        />
      </Dialog>

      <Dialog
        open={isChangeDisplayNameOpen}
        onClose={() => setIsChangeDisplayNameOpen(false)}
        title="Change display name"
      >
        <FormDisplayName
          key={formKey}
          displayName={user.displayName}
          onClose={() => setIsChangeDisplayNameOpen(false)}
        />
      </Dialog>

      <Dialog
        open={isChangeEmailOpen}
        onClose={() => setIsChangeEmailOpen(false)}
        title="Change email"
      >
        <FormEmail key={formKey} onClose={() => setIsChangeEmailOpen(false)} />
      </Dialog>

      <Dialog
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change password"
      >
        <FormPassword
          key={formKey}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </Dialog>
    </>
  );
}

export default SettingsListAccount;
