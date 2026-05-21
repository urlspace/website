import styles from "./Dashboard.module.css";

function Dashboard({
  children,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

function DashboardHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  return <header className={styles.main}>{children}</header>;
}
function AsideOne({ children }: { children: React.ReactNode }) {
  return <div className={styles.asideOne}>{children}</div>;
}

function AsideTwo({ children }: { children: React.ReactNode }) {
  return <div className={styles.asideTwo}>{children}</div>;
}

Dashboard.Header = DashboardHeader;
Dashboard.Main = DashboardMain;
Dashboard.AsideOne = AsideOne;
Dashboard.AsideTwo = AsideTwo;

export default Dashboard;
