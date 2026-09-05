import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormEmail({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");

  async function handleRequestSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/me/update-email`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
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
            setError("This email is already registered to another account.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      setStep("confirm");
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/me/update-email-confirm`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code }),
        },
      );

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("That code doesn't look right.");
            break;
          case 401:
            setError("This code has expired. Close this dialog and try again.");
            break;
          case 409:
            setError(
              "This email was just claimed by another account. Close this dialog and try again with a different address.",
            );
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
      setEmail("");
      setPassword("");
      setCode("");
      setStep("request");
      onClose();
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "confirm") {
    return (
      <Form onSubmit={handleConfirmSubmit}>
        <p>
          We emailed a confirmation code to {email}. Enter it below to finish
          changing your email.
        </p>
        <Form.Input
          autoComplete="one-time-code"
          inputMode="numeric"
          label="Confirmation code"
          maxLength={6}
          minLength={6}
          name="code"
          onChange={setCode}
          pattern="[0-9]{6}"
          placeholder="123456"
          required
          type="text"
          value={code}
        />
        <Form.Submit text="Confirm email change" textLoading="Confirming..." />
      </Form>
    );
  }

  return (
    <Form onSubmit={handleRequestSubmit}>
      <p>
        We'll email a confirmation code to your new address. Nothing changes
        until you enter it below.
      </p>
      <Form.Input
        autoComplete="email"
        label="New email"
        maxLength={254}
        name="email"
        onChange={setEmail}
        pattern="[^\s@]{1,64}@[^\s@]+\.[^\s@]+"
        placeholder="sylvester@stallone.com"
        required
        type="email"
        value={email}
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
      <Form.Submit text="Send confirmation code" textLoading="Sending..." />
    </Form>
  );
}

export default FormEmail;
