import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { collectionsQueryOptions } from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { tagsQueryOptions } from "#/queries/tags.ts";
import {
  DashboardAccordion,
  DashboardButton,
  DashboardButtonAction,
  DashboardButtonLink,
  DashboardList,
  DashboardMenu,
  Dialog,
} from "..";
import Form, { type SubmitHelpers } from "../Form/Form";
import Icon from "../Icons/Icons";
import Stack from "../Stack/Stack";
import styles from "./DashboardNav.module.css";

type CollectionRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  count: number;
};

type TagRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  count: number;
};

function DashboardNav({
  collections,
  favourite,
  forLater,
  handleClearCache,
  handleSignOut,
  onEditCollection,
  onError,
  onRenameTag,
  selectedCollection,
  selectedTags,
  setFavourite,
  setForLater,
  onAddCollection,
  onAddLink,
  setIsShortcutsOpen,
  setSelectedCollection,
  setSelectedTags,
  tags,
}: {
  collections: CollectionRow[];
  favourite: boolean;
  forLater: boolean;
  handleClearCache: () => void;
  handleSignOut: () => void;
  onEditCollection: (collection: CollectionRow) => void;
  onError: (message: string | null) => void;
  onRenameTag: (tag: TagRow) => void;
  selectedCollection: string | null;
  selectedTags: string[];
  setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  setForLater: React.Dispatch<React.SetStateAction<boolean>>;
  onAddCollection: () => void;
  onAddLink: () => void;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCollection: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: TagRow[];
}) {
  const queryClient = useQueryClient();
  const [editModeCollections, setEditModeCollections] = useState(false);
  const [editModeTags, setEditModeTags] = useState(false);
  const [deletingCollection, setDeletingCollection] =
    useState<CollectionRow | null>(null);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [deletingTag, setDeletingTag] = useState<TagRow | null>(null);
  const [isDeleteTagOpen, setIsDeleteTagOpen] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const focusAfterDeleteRef = useRef<HTMLElement | null>(null);

  function focusTargetAfterDelete(button: HTMLElement) {
    const item = button.closest("menu")?.closest("li");
    const sibling = item?.nextElementSibling ?? item?.previousElementSibling;
    return (
      sibling?.querySelector<HTMLElement>("button") ??
      item?.closest("details")?.querySelector<HTMLElement>("summary")
    );
  }

  const deleteCollection = useMutation({
    mutationFn: async ({ id, cascade }: { id: string; cascade: boolean }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collections/${id}${cascade ? "?cascade=true" : ""}`,
        { method: "DELETE", credentials: "include" },
      );
      // Reload so the route guard can clear the invalid session and cached data.
      if (
        res.status === 401 &&
        ((await res.clone().json()) as { data: string }).data === "unauthorized"
      ) {
        window.location.reload();
        throw new Error("Session expired.");
      }

      if (!res.ok)
        throw new Error(`DELETE /collections/${id} failed: ${res.status}`);
    },
    onSuccess: async (_, { id, cascade }) => {
      if (selectedCollection === id) setSelectedCollection(null);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: collectionsQueryOptions.queryKey,
        }),
        cascade
          ? queryClient.invalidateQueries({
              queryKey: tagsQueryOptions.queryKey,
            })
          : null,
        queryClient.invalidateQueries({ queryKey: linksQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
      ]);
    },
  });

  const deleteTag = useMutation({
    mutationFn: async ({ id, cascade }: { id: string; cascade: boolean }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tags/${id}${cascade ? "?cascade=true" : ""}`,
        { method: "DELETE", credentials: "include" },
      );
      // Reload so the route guard can clear the invalid session and cached data.
      if (
        res.status === 401 &&
        ((await res.clone().json()) as { data: string }).data === "unauthorized"
      ) {
        window.location.reload();
        throw new Error("Session expired.");
      }

      if (!res.ok) throw new Error(`DELETE /tags/${id} failed: ${res.status}`);
    },
    onSuccess: async (_, { id, cascade }) => {
      if (selectedTags.includes(id))
        setSelectedTags((prev) => prev.filter((t) => t !== id));
      await Promise.all([
        cascade
          ? queryClient.invalidateQueries({
              queryKey: collectionsQueryOptions.queryKey,
            })
          : null,
        queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey }),
        queryClient.invalidateQueries({ queryKey: linksQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
      ]);
    },
  });

  function handleDeleteCollection(c: CollectionRow, button: HTMLElement) {
    const target = focusTargetAfterDelete(button);
    onError(null);
    if (c.count > 0) {
      focusAfterDeleteRef.current = target ?? null;
      setFormKey((key) => key + 1);
      setCascade(false);
      setDeletingCollection(c);
      setIsDeleteCollectionOpen(true);
      return;
    }
    deleteCollection.mutate(
      { id: c.id, cascade: false },
      {
        onSuccess: () => target?.focus(),
        onError: () =>
          onError(
            `We couldn't delete collection "${c.name}". Please try again.`,
          ),
      },
    );
  }

  function handleDeleteTag(t: TagRow, button: HTMLElement) {
    const target = focusTargetAfterDelete(button);
    onError(null);
    if (t.count > 0) {
      focusAfterDeleteRef.current = target ?? null;
      setFormKey((key) => key + 1);
      setCascade(false);
      setDeletingTag(t);
      setIsDeleteTagOpen(true);
      return;
    }
    deleteTag.mutate(
      { id: t.id, cascade: false },
      {
        onSuccess: () => target?.focus(),
        onError: () =>
          onError(`We couldn't delete tag "${t.name}". Please try again.`),
      },
    );
  }

  async function handleSubmitDeleteCollection(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();
    if (!deletingCollection) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await deleteCollection.mutateAsync({
        id: deletingCollection.id,
        cascade,
      });
      setIsDeleteCollectionOpen(false);
    } catch {
      focusAfterDeleteRef.current = null;
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitDeleteTag(
    e: React.SubmitEvent<HTMLFormElement>,
    { setError, setLoading }: SubmitHelpers,
  ) {
    e.preventDefault();
    if (!deletingTag) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await deleteTag.mutateAsync({ id: deletingTag.id, cascade });
      setIsDeleteTagOpen(false);
    } catch {
      focusAfterDeleteRef.current = null;
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function linksLabel(count: number) {
    return count === 1 ? "1 link" : `${count} links`;
  }

  return (
    <div className={styles.nav}>
      <Stack gap={1.5}>
        <Stack gap={0.5}>
          <DashboardList ariaLabel="Quick filters">
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.List />}
                onClick={() => {
                  setFavourite(false);
                  setForLater(false);
                  setSelectedCollection(null);
                  setSelectedTags([]);
                }}
                text="All"
              />
            </DashboardList.Li>
            <DashboardList.Li>
              <DashboardButton
                ariaPressed={favourite}
                icon={<Icon.Heart />}
                onClick={() => setFavourite((prev) => !prev)}
                text="Favourite"
              />
            </DashboardList.Li>
            <DashboardList.Li>
              <DashboardButton
                ariaPressed={forLater}
                icon={<Icon.Coffee />}
                onClick={() => setForLater((prev) => !prev)}
                text="For later"
              />
            </DashboardList.Li>
          </DashboardList>

          <DashboardButton
            icon={<Icon.Plus />}
            onClick={onAddLink}
            text="Add link"
          />
        </Stack>
        <DashboardAccordion summary="Collections">
          <Stack gap={0.5}>
            {collections.some((c) => !c.public) ? (
              <DashboardList ariaLabel="Private collections">
                {collections
                  .filter((c) => !c.public)
                  .map((c, index, arr) => {
                    const isDeleting =
                      deleteCollection.isPending &&
                      deleteCollection.variables?.id === c.id;
                    return (
                      <DashboardList.Li key={c.id} loading={isDeleting}>
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <DashboardButton
                            icon={
                              c.public ? <Icon.FolderPublic /> : <Icon.Folder />
                            }
                            onClick={() =>
                              setSelectedCollection((prev) =>
                                prev === c.id ? null : c.id,
                              )
                            }
                            ariaPressed={selectedCollection === c.id}
                            disabled={isDeleting}
                            text={c.name}
                            counter={c.count}
                          />
                        </div>
                        {editModeCollections ? (
                          <DashboardMenu fadeIn order={arr.length - index}>
                            <DashboardMenu.Li>
                              <DashboardButtonAction
                                text="Edit"
                                ariaLabel={`Edit collection "${c.name}"`}
                                disabled={isDeleting}
                                onClick={() => onEditCollection(c)}
                              />
                            </DashboardMenu.Li>
                            <DashboardMenu.Li>
                              <DashboardButtonAction
                                text="Delete"
                                ariaLabel={`Delete collection "${c.name}"`}
                                disabled={isDeleting}
                                onClick={(e) =>
                                  handleDeleteCollection(c, e.currentTarget)
                                }
                                destructive
                              />
                            </DashboardMenu.Li>
                          </DashboardMenu>
                        ) : null}
                      </DashboardList.Li>
                    );
                  })}
              </DashboardList>
            ) : null}

            {collections.some((c) => c.public) ? (
              <DashboardList ariaLabel="Public collections">
                {collections
                  .filter((c) => c.public)
                  .map((c, index, arr) => {
                    const isDeleting =
                      deleteCollection.isPending &&
                      deleteCollection.variables?.id === c.id;
                    return (
                      <DashboardList.Li key={c.id} loading={isDeleting}>
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <DashboardButton
                            icon={
                              c.public ? <Icon.FolderPublic /> : <Icon.Folder />
                            }
                            onClick={() =>
                              setSelectedCollection((prev) =>
                                prev === c.id ? null : c.id,
                              )
                            }
                            ariaPressed={selectedCollection === c.id}
                            disabled={isDeleting}
                            text={c.name}
                            counter={c.count}
                          />
                        </div>
                        {editModeCollections ? (
                          <DashboardMenu fadeIn order={arr.length - index}>
                            <DashboardMenu.Li>
                              <DashboardButtonAction
                                text="Edit"
                                ariaLabel={`Edit collection "${c.name}"`}
                                disabled={isDeleting}
                                onClick={() => onEditCollection(c)}
                              />
                            </DashboardMenu.Li>
                            <DashboardMenu.Li>
                              <DashboardButtonAction
                                text="Delete"
                                ariaLabel={`Delete collection "${c.name}"`}
                                disabled={isDeleting}
                                onClick={(e) =>
                                  handleDeleteCollection(c, e.currentTarget)
                                }
                                destructive
                              />
                            </DashboardMenu.Li>
                          </DashboardMenu>
                        ) : null}
                      </DashboardList.Li>
                    );
                  })}
              </DashboardList>
            ) : null}

            <div>
              <DashboardButton
                icon={<Icon.Plus />}
                onClick={onAddCollection}
                text="Add collection"
              />
              {collections.length ? (
                <DashboardButton
                  ariaPressed={editModeCollections}
                  icon={<Icon.Edit />}
                  onClick={() => setEditModeCollections((prev) => !prev)}
                  text="Edit collections"
                />
              ) : null}
            </div>
          </Stack>
        </DashboardAccordion>
        {tags.length ? (
          <DashboardAccordion summary="Tags">
            <Stack gap={0.5}>
              <DashboardList ariaLabel="Tags">
                {tags.map((t, index, arr) => {
                  const isDeleting =
                    deleteTag.isPending && deleteTag.variables?.id === t.id;
                  return (
                    <DashboardList.Li key={t.id} loading={isDeleting}>
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <DashboardButton
                          icon={<Icon.Tag />}
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.includes(t.id)
                                ? prev.filter((id) => id !== t.id)
                                : [...prev, t.id],
                            )
                          }
                          ariaPressed={selectedTags.includes(t.id)}
                          disabled={isDeleting}
                          text={t.name}
                          counter={t.count}
                        />
                      </div>

                      {editModeTags ? (
                        <DashboardMenu fadeIn order={arr.length - index}>
                          <DashboardMenu.Li>
                            <DashboardButtonAction
                              text="Rename"
                              ariaLabel={`Rename tag "${t.name}"`}
                              disabled={isDeleting}
                              onClick={() => onRenameTag(t)}
                            />
                          </DashboardMenu.Li>
                          <DashboardMenu.Li>
                            <DashboardButtonAction
                              text="Delete"
                              ariaLabel={`Delete tag "${t.name}"`}
                              disabled={isDeleting}
                              onClick={(e) =>
                                handleDeleteTag(t, e.currentTarget)
                              }
                              destructive
                            />
                          </DashboardMenu.Li>
                        </DashboardMenu>
                      ) : null}
                    </DashboardList.Li>
                  );
                })}
              </DashboardList>

              <div>
                <DashboardButton
                  ariaPressed={editModeTags}
                  icon={<Icon.Edit />}
                  text="Edit tags"
                  onClick={() => setEditModeTags((prev) => !prev)}
                />
              </div>
            </Stack>
          </DashboardAccordion>
        ) : null}
        <DashboardList ariaLabel="Account">
          <DashboardList.Li>
            <DashboardButtonLink
              icon={<Icon.User />}
              to="/settings"
              text="Account settings"
              preload={false}
            />
          </DashboardList.Li>
          {
            // <DashboardList.Li>
            //   <DashboardButton
            //     icon={<Icon.Import />}
            //     onClick={() => alert("Import & export")}
            //     text="Import & export"
            //   />
            // </DashboardList.Li>
            // <DashboardList.Li>
            //   <DashboardButton
            //     icon={<Icon.Extension />}
            //     onClick={() => alert("Browsers extensions")}
            //     text="Browsers extensions"
            //   />
            // </DashboardList.Li>
          }
          <DashboardList.Li hideOnTouchDevice>
            <DashboardButton
              icon={<Icon.Keyboard />}
              onClick={() => setIsShortcutsOpen(true)}
              text="Keyboard shortcuts"
            />
          </DashboardList.Li>
          <DashboardList.Li>
            <DashboardButton
              icon={<Icon.Star />}
              onClick={() => alert("Pro features")}
              text="Pro features"
            />
          </DashboardList.Li>
          <DashboardList.Li>
            <DashboardButton
              icon={<Icon.Reload />}
              onClick={handleClearCache}
              text="Clear cache and sync"
            />
          </DashboardList.Li>
          <DashboardList.Li>
            <DashboardButton
              icon={<Icon.SignOut />}
              onClick={handleSignOut}
              text="Sign out"
            />
          </DashboardList.Li>
        </DashboardList>
      </Stack>

      <Dialog
        open={isDeleteCollectionOpen}
        onClose={() => setIsDeleteCollectionOpen(false)}
        onClosed={() => {
          focusAfterDeleteRef.current?.focus();
          focusAfterDeleteRef.current = null;
        }}
        title="Delete collection"
      >
        {deletingCollection ? (
          <Form key={formKey} onSubmit={handleSubmitDeleteCollection}>
            <p>
              Deleting this collection cannot be undone. All links will lose
              their association with the collection. Tick the box below to also
              permanently remove those links.
            </p>
            <Form.Checkbox
              label={`Also delete ${linksLabel(deletingCollection.count)} in this collection`}
              name="cascade-collection"
              onChange={setCascade}
              value={cascade}
            />
            {deletingCollection.public ? (
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
                in 1998. Think twice before deleting this public collection.
              </Form.Warning>
            ) : null}
            <Form.Submit
              text={
                cascade
                  ? `Delete collection and ${linksLabel(deletingCollection.count)}`
                  : "Delete collection"
              }
              textLoading="Deleting..."
            />
          </Form>
        ) : null}
      </Dialog>

      <Dialog
        open={isDeleteTagOpen}
        onClose={() => setIsDeleteTagOpen(false)}
        onClosed={() => {
          focusAfterDeleteRef.current?.focus();
          focusAfterDeleteRef.current = null;
        }}
        title="Delete tag"
      >
        {deletingTag ? (
          <Form key={formKey} onSubmit={handleSubmitDeleteTag}>
            <p>
              Deleting this tag cannot be undone. All links will lose their
              association with the tag. Tick the box below to also permanently
              remove those links.
            </p>
            <Form.Checkbox
              label={`Also delete ${linksLabel(deletingTag.count)} with this tag`}
              name="cascade-tag"
              onChange={setCascade}
              value={cascade}
            />
            <Form.Submit
              text={
                cascade
                  ? `Delete tag and ${linksLabel(deletingTag.count)}`
                  : "Delete tag"
              }
              textLoading="Deleting..."
            />
          </Form>
        ) : null}
      </Dialog>
    </div>
  );
}

export default DashboardNav;
