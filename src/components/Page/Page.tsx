import "./Page.css";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="page__content">{children}</div>
    </div>
  );
}

export default Page;
