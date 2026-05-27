import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import Form from "../Form/Form.tsx";

function FormAddLink({
  onClose,
  collections,
}: {
  onClose: () => void;
  collections: Array<{
    id: string;
    name: string;
  }>;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const [tags, setTags] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [forLater, setForLater] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const descriptionTrimmed = description.trim();
    const tagsTrimmed = tags.trim();

    await fetch(`${import.meta.env.VITE_API_URL}/links`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        url,
        ...(descriptionTrimmed && { description: descriptionTrimmed }),
        ...(collection && { collectionId: collection }),
        ...(tagsTrimmed && {
          tags: tagsTrimmed.split(",").map((t) => t.trim()),
          favourite,
          forLater,
        }),
      }),
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["links"] }),
      queryClient.invalidateQueries({ queryKey: ["tags"] }),
    ]);

    setTitle("");
    setUrl("");
    setDescription("");
    setCollection("");
    setTags("");
    setFavourite(false);
    setForLater(false);
    onClose();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input
        label="Title"
        name="title"
        onChange={setTitle}
        placeholder="Boo"
        required
        type="text"
        value={title}
        minLength={3}
        maxLength={255}
      />
      <Form.Input
        label="URL"
        name="url"
        onChange={setUrl}
        placeholder="https://cloudflare.com"
        required
        type="url"
        value={url}
        maxLength={2048}
      />
      <Form.Input
        label="Description"
        name="description"
        onChange={setDescription}
        placeholder="What a cool description"
        type="text"
        value={description}
        maxLength={512}
      />
      <Form.Select
        label="Collection"
        name="collection"
        onChange={setCollection}
        value={collection}
        options={collections.map((c) => ({ name: c.name, value: c.id }))}
        placeholder="Select a collection"
      />
      <Form.Input
        label="Tags"
        name="tags"
        onChange={setTags}
        placeholder="comma,separated,tags"
        type="text"
        value={tags}
      />
      <Form.Row>
        <Form.Checkbox
          label="Favourite"
          name="favourite"
          onChange={setFavourite}
          value={favourite}
        />
        <Form.Checkbox
          label="For later"
          name="forlater"
          onChange={setForLater}
          value={forLater}
        />
      </Form.Row>
      <Button type="submit" text="Add new link" />
    </Form>
  );
}

export default FormAddLink;
