import "./Stack.css";

function Stack({
  children,
  gap = 1,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div className="stack" style={{ "--gap": gap } as React.CSSProperties}>
      {children}
    </div>
  );
}

export default Stack;
