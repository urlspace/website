import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormPassword({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/me/update-password`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("That password doesn't meet our requirements.");
            break;
          case 401:
            setError("Incorrect current password.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      onClose();
      queryClient.clear();
      await router.invalidate();
      await router.navigate({ to: "/auth/signin" });
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <p>
        Changing your password will sign you out of all devices, including this
        one. You'll need to sign in again with your new password.
      </p>
      <Form.Input
        autoComplete="current-password"
        description="Enter your current password to confirm this change."
        label="Current password"
        maxLength={128}
        minLength={12}
        name="currentPassword"
        onChange={setCurrentPassword}
        placeholder="Min 12 characters"
        required
        type="password"
        value={currentPassword}
      />
      <Form.Input
        autoComplete="new-password"
        label="New password"
        maxLength={128}
        minLength={12}
        name="newPassword"
        onChange={setNewPassword}
        placeholder="Min 12 characters"
        required
        type="password"
        value={newPassword}
      />
      <Form.Input
        autoComplete="new-password"
        label="Repeat new password"
        maxLength={128}
        minLength={12}
        name="newPasswordConfirm"
        onChange={setNewPasswordConfirm}
        placeholder="Min 12 characters"
        required
        type="password"
        value={newPasswordConfirm}
      />
      <Form.Submit text="Change password" textLoading="Changing..." />
    </Form>
  );
}

export default FormPassword;
