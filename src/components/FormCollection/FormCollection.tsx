import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormCollection({
  collections,
  isPro,
  onClose,
}: {
  collections: Array<{
    id: string;
    name: string;
  }>;
  isPro: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicCollection, setPublicCollection] = useState(false);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    if (
      collections.some(
        (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
      )
    ) {
      setError("You already have a collection with that name.");
      return;
    }

    setError(null);
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
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
        label="Public collection"
        name="public"
        onChange={setPublicCollection}
        value={publicCollection}
        disabled={!isPro}
        description={
          isPro ? null : (
            <>
              Available only to pro users.{" "}
              {
                // TODO: change to /upgrade when the page is ready
              }
              <Link to="/blog">Upgrade now</Link>.
            </>
          )
        }
      />
      <Form.Submit text="Add new collection" textLoading="Adding..." />
    </Form>
  );
}

export default FormCollection;
