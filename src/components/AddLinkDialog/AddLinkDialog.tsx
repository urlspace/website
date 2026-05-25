import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import Dialog from "../Dialog/Dialog.tsx";
import Form from "../Form/Form.tsx";

function AddLinkDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

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
        ...(tagsTrimmed && {
          tags: tagsTrimmed.split(",").map((t) => t.trim()),
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
    setTags("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add new link">
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Title"
          name="title"
          onChange={setTitle}
          placeholder="Boo"
          required
          type="text"
          value={title}
        />
        <Form.Input
          label="URL"
          name="url"
          onChange={setUrl}
          placeholder="https://cloudflare.com"
          required
          type="url"
          value={url}
        />
        <Form.Input
          label="Description"
          name="description"
          onChange={setDescription}
          placeholder="What a cool description"
          type="text"
          value={description}
        />
        <Form.Input
          label="Tags"
          name="tags"
          onChange={setTags}
          placeholder="comma,separated,tags"
          type="text"
          value={tags}
        />
        <Button type="submit" text="Add new link" />
      </Form>
    </Dialog>
  );
}

export default AddLinkDialog;
