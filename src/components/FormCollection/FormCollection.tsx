import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { collectionsQueryOptions } from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { slugify } from "#/utils.ts";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";
import { Button } from "../Button/Button.tsx";
import CopyBox from "../CopyBox/CopyBox.tsx";
import Stack from "../Stack/Stack.tsx";

function normalizeName(name: string) {
  return name.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

function FormCollection({
  collection,
  collections,
  isPro,
  isAdmin,
  username,
  onClose,
}: {
  collection?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    public: boolean;
  };
  collections: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isPro: boolean;
  isAdmin: boolean;
  username: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!collection;
  const canPublish = isPro || isAdmin;
  const duplicateNameError = "You already have a collection with that name.";
  const duplicateSlugError = "Another collection already uses that slug.";

  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [publicCollection, setPublicCollection] = useState(
    canPublish ? (collection?.public ?? false) : false,
  );
  // New collections suggest a slug from the name until it's edited. Existing
  // ones keep theirs, since it may be in links already shared.
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [isSlugEdited, setIsSlugEdited] = useState(isEdit);
  const slugValue = isSlugEdited ? slug : slugify(name);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Collection name must be at least 2 characters.");
      return;
    }

    // Catch duplicate names, but allow editing the existing collection.
    // Mirrors the API's case-insensitive check; the 409 catches edge cases.
    if (
      collections.some(
        (c) =>
          c.id !== collection?.id &&
          normalizeName(c.name) === normalizeName(trimmedName),
      )
    ) {
      setError(duplicateNameError);
      return;
    }

    if (
      collections.some(
        (c) => c.id !== collection?.id && c.slug === slugValue.trim(),
      )
    ) {
      setError(duplicateSlugError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        isEdit
          ? `${import.meta.env.VITE_API_URL}/collections/${collection.id}`
          : `${import.meta.env.VITE_API_URL}/collections`,
        {
          method: isEdit ? "PUT" : "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            description: description.trim(),
            public: canPublish && publicCollection,
            slug: slugValue.trim(),
          }),
        },
      );

      // Reload so the route guard can clear the invalid session and cached data.
      if (
        res.status === 401 &&
        ((await res.clone().json()) as { data: string }).data === "unauthorized"
      ) {
        window.location.reload();
        return;
      }

      if (!res.ok) {
        switch (res.status) {
          case 400:
            setError("Incorrect body.");
            break;
          case 409:
            setError(
              ((await res.json()) as { data: string }).data ===
                "slug is already taken"
                ? duplicateSlugError
                : duplicateNameError,
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

      const saved = (
        (await res.json()) as { data: { slug: string; public: boolean } }
      ).data;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: collectionsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: linksQueryKey }),
      ]);

      if (!isEdit) {
        setName("");
        setDescription("");
        setPublicCollection(false);
        setSlug("");
        setIsSlugEdited(false);
      }

      // Public collections stay in the dialog to show the saved address.
      if (saved.public) {
        setSavedUrl(`${window.location.origin}/${username}/${saved.slug}`);
        return;
      }
      onClose();
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (savedUrl) {
    return (
      <Stack>
        <p role="status">Collection saved. It's public at this address:</p>
        <CopyBox value={savedUrl} label="Public URL" />
        <Button text="Done" type="button" onClick={onClose} />
      </Stack>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input
        label="Collection name"
        name="collection-name"
        onChange={(value) => {
          setName(value);
          // A cleared slug starts following the name again on the next edit.
          if (isSlugEdited && slug === "") {
            setIsSlugEdited(false);
          }
        }}
        placeholder="Cats"
        required
        type="text"
        value={name}
        minLength={2}
        maxLength={128}
        pattern="[^\p{Cc}]{2,128}"
        description="Between 2 and 128 characters."
      />

      <Form.Input
        label="Description"
        name="description-collection"
        onChange={setDescription}
        placeholder="What a cool description"
        type="text"
        value={description}
        maxLength={1024}
        pattern="[^\p{Cc}]{0,1024}"
        description="Up to 1024 characters."
      />

      <Form.Input
        label="URL name"
        name="collection-slug"
        onChange={(value) => {
          setSlug(value.toLowerCase());
          setIsSlugEdited(true);
        }}
        placeholder="cats"
        required
        type="text"
        value={slugValue}
        minLength={2}
        maxLength={128}
        pattern="(?=.{2,128}$)[a-z0-9]+(-[a-z0-9]+)*"
        description="Collection's slug. Lowercase letters, numbers and hyphens only."
      />

      <Form.Checkbox
        label="Public collection"
        name="public"
        onChange={setPublicCollection}
        value={canPublish && publicCollection}
        disabled={!canPublish}
        description={
          canPublish ? null : (
            <>
              Available only to pro users.{" "}
              {
                // TODO: change to /upgrade when the page is ready
              }
              <Link to="/docs">Upgrade now</Link>.
            </>
          )
        }
      />

      {isEdit &&
      collection.public &&
      publicCollection &&
      slugValue.trim() !== collection.slug ? (
        <Form.Warning>
          Sir Tim Berners-Lee, the man who invented the World Wide Web,
          published{" "}
          <a
            href="https://www.w3.org/Provider/Style/URI"
            target="_blank"
            rel="noreferrer"
            aria-description="Opens in a new tab"
          >
            "Cool URIs don't change"
          </a>{" "}
          in 1998. Think twice before changing the slug for this public
          collection.
        </Form.Warning>
      ) : null}

      <Form.Submit
        text={isEdit ? "Save changes" : "Add new collection"}
        textLoading={isEdit ? "Saving..." : "Adding..."}
      />
    </Form>
  );
}

export default FormCollection;
