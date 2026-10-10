import { Link } from "@tanstack/react-router";
import { useState } from "react";
import styles from "./PublicHeader.module.css";
import { DashboardButton, Drawer, Icon, Logo } from "../";

function PublicHeader({ hasSession }: { hasSession: boolean }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  function links(onNavigate?: () => void) {
    return (
      <>
        <li>
          <Link to="/docs" onClick={onNavigate}>
            Documentation
          </Link>
        </li>
        <li>
          <Link to="/pricing" onClick={onNavigate}>
            Pricing
          </Link>
        </li>
        {hasSession ? (
          <li>
            <Link to="/dashboard" onClick={onNavigate}>
              Dashboard
            </Link>
          </li>
        ) : (
          <>
            {/* <li> */}
            {/*   <Link to="/auth/signin" onClick={onNavigate}> */}
            {/*     Sign in */}
            {/*   </Link> */}
            {/* </li> */}
            {/* <li> */}
            {/*   <Link to="/auth/signup" onClick={onNavigate}> */}
            {/*     Sign up */}
            {/*   </Link> */}
            {/* </li> */}
          </>
        )}
      </>
    );
  }

  return (
    <header className={styles.header}>
      <Logo to="/" />
      <nav aria-label="Main navigation" className={styles.nav}>
        <ul className={styles.navList}>{links()}</ul>
      </nav>
      <div className={styles.trigger}>
        <DashboardButton
          icon={<Icon.List />}
          onClick={() => setIsNavOpen(true)}
          text="Menu"
        />
      </div>
      <Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
        <nav aria-label="Main navigation">
          <ul className={styles.drawerList}>
            {links(() => setIsNavOpen(false))}
          </ul>
        </nav>
      </Drawer>
    </header>
  );
}

export default PublicHeader;
