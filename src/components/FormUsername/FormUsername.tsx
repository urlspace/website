import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormUsername({
  onClose,
  username,
}: {
  onClose: () => void;
  username: string;
}) {
  const queryClient = useQueryClient();

  const [value, setValue] = useState(username);
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/me/update-username`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: value, password }),
        },
      );

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("Please check your input and try again.");
            break;
          case 401:
            setError("Incorrect password.");
            break;
          case 409:
            setError("This username is already taken.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["me"] });

      setPassword("");
      onClose();
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input
        autoComplete="nickname"
        description="Use 3 to 32 lowercase letters or digits. Hyphens and underscores are also allowed, but not as a prefix or suffix."
        label="Username"
        maxLength={32}
        minLength={3}
        name="username"
        onChange={setValue}
        pattern="[a-z0-9]([a-z0-9_\-]*[a-z0-9])?"
        placeholder="rocky"
        required
        type="text"
        value={value}
      />
      <Form.Input
        autoComplete="current-password"
        label="Current password"
        maxLength={128}
        minLength={12}
        name="password"
        onChange={setPassword}
        placeholder="Min 12 characters"
        required
        type="password"
        value={password}
      />
      <Form.Submit text="Save changes" textLoading="Saving..." />
    </Form>
  );
}

export default FormUsername;
