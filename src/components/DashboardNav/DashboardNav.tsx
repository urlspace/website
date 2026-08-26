import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  DashboardAccordion,
  DashboardButton,
  DashboardButtonAction,
  DashboardButtonLink,
  DashboardList,
  DashboardMenu,
} from "..";
import Icon from "../Icons/Icons";
import Stack from "../Stack/Stack";
import styles from "./DashboardNav.module.css";

type CollectionRow = {
  id: string;
  name: string;
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
  onRenameTag,
  selectedCollection,
  selectedTags,
  setFavourite,
  setForLater,
  setIsAddCollectionkOpen,
  setIsAddLinkOpen,
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
  onRenameTag: (tag: TagRow) => void;
  selectedCollection: string | null;
  selectedTags: string[];
  setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  setForLater: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddCollectionkOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddLinkOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCollection: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: TagRow[];
}) {
  const queryClient = useQueryClient();
  const [editModeCollections, setEditModeCollections] = useState(false);
  const [editModeTags, setEditModeTags] = useState(false);

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collections/${id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok)
        throw new Error(`DELETE /collections/${id} failed: ${res.status}`);
    },
    onSuccess: async (_, id) => {
      if (selectedCollection === id) setSelectedCollection(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collections"] }),
        queryClient.invalidateQueries({ queryKey: ["links"] }),
      ]);
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tags/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`DELETE /tags/${id} failed: ${res.status}`);
    },
    onSuccess: async (_, id) => {
      if (selectedTags.includes(id))
        setSelectedTags((prev) => prev.filter((t) => t !== id));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tags"] }),
        queryClient.invalidateQueries({ queryKey: ["links"] }),
      ]);
    },
  });

  return (
    <nav className={styles.nav}>
      <Stack gap={1.5}>
        <Stack gap={0.5}>
          <DashboardList>
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
            onClick={() => setIsAddLinkOpen(true)}
            text="Add link"
          />
        </Stack>
        <DashboardAccordion summary="Collections">
          <Stack gap={0.5}>
            <DashboardList>
              {collections.map((c, index, arr) => (
                <DashboardList.Li
                  key={c.id}
                  loading={
                    deleteCollection.isPending &&
                    deleteCollection.variables === c.id
                  }
                >
                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <DashboardButton
                      icon={<Icon.Folder />}
                      onClick={() =>
                        setSelectedCollection((prev) =>
                          prev === c.id ? null : c.id,
                        )
                      }
                      ariaPressed={selectedCollection === c.id}
                      text={c.name}
                      counter={c.count}
                    />
                  </div>
                  {editModeCollections ? (
                    <DashboardMenu fadeIn order={arr.length - index}>
                      <DashboardMenu.Li>
                        <DashboardButtonAction
                          text="Edit"
                          onClick={() => onEditCollection(c)}
                        />
                      </DashboardMenu.Li>
                      <DashboardMenu.Li>
                        <DashboardButtonAction
                          text="Delete"
                          onClick={() => deleteCollection.mutate(c.id)}
                          destructive
                        />
                      </DashboardMenu.Li>
                    </DashboardMenu>
                  ) : null}
                </DashboardList.Li>
              ))}
            </DashboardList>

            <div>
              <DashboardButton
                icon={<Icon.Plus />}
                onClick={() => setIsAddCollectionkOpen(true)}
                text="Add collection"
              />
              {collections.length ? (
                <DashboardButton
                  ariaPressed={editModeCollections}
                  icon={<Icon.Edit />}
                  onClick={() => setEditModeCollections((prev) => !prev)}
                  text={
                    editModeCollections
                      ? "Disable edit mode"
                      : "Edit collections"
                  }
                />
              ) : null}
            </div>
          </Stack>
        </DashboardAccordion>
        {tags.length ? (
          <DashboardAccordion summary="Tags">
            <Stack gap={0.5}>
              <DashboardList>
                {tags.map((t, index, arr) => (
                  <DashboardList.Li
                    key={t.id}
                    loading={
                      deleteTag.isPending && deleteTag.variables === t.id
                    }
                  >
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
                        text={t.name}
                        counter={t.count}
                      />
                    </div>

                    {editModeTags ? (
                      <DashboardMenu fadeIn order={arr.length - index}>
                        <DashboardMenu.Li>
                          <DashboardButtonAction
                            text="Rename"
                            onClick={() => onRenameTag(t)}
                          />
                        </DashboardMenu.Li>
                        <DashboardMenu.Li>
                          <DashboardButtonAction
                            text="Delete"
                            onClick={() => deleteTag.mutate(t.id)}
                            destructive
                          />
                        </DashboardMenu.Li>
                      </DashboardMenu>
                    ) : null}
                  </DashboardList.Li>
                ))}
              </DashboardList>

              <div>
                <DashboardButton
                  ariaPressed={editModeTags}
                  icon={<Icon.Edit />}
                  text={editModeTags ? "Disable edit mode" : "Edit tags"}
                  onClick={() => setEditModeTags((prev) => !prev)}
                />
              </div>
            </Stack>
          </DashboardAccordion>
        ) : null}
        <DashboardList>
          <DashboardList.Li>
            <DashboardButtonLink
              icon={<Icon.User />}
              to="/settings"
              text="Account settings"
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
    </nav>
  );
}

export default DashboardNav;
