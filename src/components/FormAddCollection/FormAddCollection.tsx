import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import Form from "../Form/Form.tsx";

function FormAddCollection({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicCollection, setPublicCollection] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    if (isLoading) return;

    e.preventDefault();

    setError(null);
    setIsLoading(true);
    try {
      const descriptionTrimmed = description.trim();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          ...(descriptionTrimmed && { description: descriptionTrimmed }),
          public: publicCollection,
        }),
      });

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("Incorrect body.");
            break;
          case 429:
            setError("Too many attempts. Try again in a moment.");
            break;
          default:
            setError("Something went wrong. Try again in a moment.");
        }
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setName("");
      onClose();
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Error errorMessage={error} />
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

      <Form.Input
        label="Description"
        name="description-collection"
        onChange={setDescription}
        placeholder="What a cool description"
        type="text"
        value={description}
        maxLength={512}
      />

      <Form.Checkbox
        label="Public"
        name="public"
        onChange={setPublicCollection}
        value={publicCollection}
        disabled={true}
        description="Available only to pro users"
      />
      <Button type="submit" text="Add new collection" />
    </Form>
  );
}

export default FormAddCollection;
