import "./Page.css";

function Page({
  children,
  narrow,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className="page">
      <div
        className={
          narrow ? "page__content page__content--narrow" : "page__content"
        }
      >
        {children}
      </div>
    </div>
  );
}

export default Page;
