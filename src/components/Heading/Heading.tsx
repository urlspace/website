import "./Heading.css";

function Heading({
  level,
  text,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}) {
  const Tag = `h${level}` as const;

  return (
    <div className="heading">
      <Tag className={`heading__inner heading__inner--${Tag}`}>{text}</Tag>
    </div>
  );
}

export default Heading;
