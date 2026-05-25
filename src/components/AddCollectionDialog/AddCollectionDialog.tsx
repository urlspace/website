import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import Dialog from "../Dialog/Dialog.tsx";
import Form from "../Form/Form.tsx";

function AddCollectionDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });

    await queryClient.invalidateQueries({ queryKey: ["collections"] });
    setName("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add new collection">
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Collection name"
          name="collection-name"
          onChange={setName}
          placeholder="Cats"
          required
          type="text"
          value={name}
          minLength={2}
          maxLength={255}
        />
        <Button type="submit" text="Add new collection" />
      </Form>
    </Dialog>
  );
}

export default AddCollectionDialog;
