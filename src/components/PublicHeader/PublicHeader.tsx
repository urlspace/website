import { Link } from "@tanstack/react-router";
import styles from "./PublicHeader.module.css";
import { Logo } from "../";

function PublicHeader({ hasSession }: { hasSession: boolean }) {
  return (
    <header className={styles.header}>
      <Logo to="/" />
      {
        // <nav aria-label="Main navigation">
        //   <ul className={styles.navList}>
        //     <li>
        //       <Link to="/docs">Documentation</Link>
        //     </li>
        //     <li>
        //       <Link to="/blog">Blog</Link>
        //     </li>
        //     {hasSession ? (
        //       <li>
        //         <Link to="/dashboard">Dashboard</Link>
        //       </li>
        //     ) : (
        //       <>
        //         <li>
        //           <Link to="/auth/signin">Sign in</Link>
        //         </li>
        //         <li>
        //           <Link to="/auth/signup">Sign up</Link>
        //         </li>
        //       </>
        //     )}
        //   </ul>
        // </nav>
      }
    </header>
  );
}

export default PublicHeader;
