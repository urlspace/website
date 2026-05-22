import Icon from "../Icons/Icons";
import {
  DashboardAccordion,
  DashboardButton,
  DashboardList,
  DashboardLogo,
  DashboardSection,
} from "..";
import Stack from "../Stack/Stack";

type CollectionRow = {
  id: string;
  name: string;
  description: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
};

type TagRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function DashboardNav({
  showLogo,
  favourite,
  forLater,
  setFavourite,
  setForLater,
  setSelectedCollection,
  setSelectedTags,
  collections,
  tags,
  selectedCollection,
  selectedTags,
  handleSignOut,
  showUserSection,
}: {
  showLogo: boolean;
  favourite: boolean;
  forLater: boolean;
  setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  setForLater: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCollection: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  collections: CollectionRow[];
  tags: TagRow[];
  selectedCollection: string | null;
  selectedTags: string[];
  handleSignOut: () => void;
  showUserSection: boolean;
}) {
  return (
    <>
      <DashboardSection>
        {showLogo ? <DashboardLogo /> : null}
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
      </DashboardSection>
      {collectoins.length ? (
        <DashboardSection>
          <DashboardAccordion summary="Collections">
            <Stack>
              <DashboardList>
                {collections.map((c) => (
                  <DashboardList.Li key={c.id}>
                    <DashboardButton
                      icon={<Icon.Folder />}
                      onClick={() =>
                        setSelectedCollection((prev) =>
                          prev === c.id ? null : c.id,
                        )
                      }
                      ariaPressed={selectedCollection === c.id}
                      text={c.name}
                    />
                  </DashboardList.Li>
                ))}
              </DashboardList>
              <DashboardButton
                icon={<Icon.Edit />}
                onClick={() => alert("Show filters")}
                text="Edit collections"
              />
            </Stack>
          </DashboardAccordion>
        </DashboardSection>
      ) : null}
      {tags.length ? (
        <DashboardSection>
          <DashboardAccordion summary="Tags">
            <Stack>
              <DashboardList>
                {tags.map((t) => (
                  <DashboardList.Li key={t.id}>
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
                    />
                  </DashboardList.Li>
                ))}
              </DashboardList>

              <div>
                <DashboardButton
                  icon={<Icon.Edit />}
                  text="Edit tags"
                  onClick={() => alert("Show filters")}
                />
              </div>
            </Stack>
          </DashboardAccordion>
        </DashboardSection>
      ) : null}

      {showUserSection ? (
        <DashboardSection>
          <DashboardList>
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.User />}
                onClick={() => alert("Show profile")}
                text="Profile"
              />
            </DashboardList.Li>
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.Settings />}
                onClick={() => alert("Show settings")}
                text="Settings"
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
          {
            // <h1>User</h1>
            // <p>Username: {user.username}</p>
            // <p>Display name: {user.displayName}</p>
            // <p>Email: {user.email}</p>
            // <p>Pro: {user.isPro ? "Yes" : "No"}</p>
            // <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
            // <p>Member since: {user.createdAt.slice(0, 10)}</p>
          }
        </DashboardSection>
      ) : null}
    </>
  );
}

export default DashboardNav;
