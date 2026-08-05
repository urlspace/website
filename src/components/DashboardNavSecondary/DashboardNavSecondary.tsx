import { DashboardButton, DashboardButtonLink, DashboardList } from "..";
import Icon from "../Icons/Icons";
import styles from "./DashboardNavSecondary.module.css";

function DashboardNavSecondary({
  handleClearCache,
  handleSignOut,
}: {
  handleClearCache: () => void;
  handleSignOut: () => void;
}) {
  return (
    <nav className={styles.nav}>
      <DashboardList>
        <DashboardList.Li>
          <DashboardButtonLink
            icon={<Icon.User />}
            to="/profile"
            text="Profile"
          />
        </DashboardList.Li>
        <DashboardList.Li>
          <DashboardButton
            icon={<Icon.Import />}
            onClick={() => alert("Import & export")}
            text="Import & export"
          />
        </DashboardList.Li>
        <DashboardList.Li>
          <DashboardButton
            icon={<Icon.Extension />}
            onClick={() => alert("Browsers extensions")}
            text="Browsers extensions"
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
    </nav>
  );
}

export default DashboardNavSecondary;
