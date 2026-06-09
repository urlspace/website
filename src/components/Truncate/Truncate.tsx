const Truncate = ({ children }: { children: React.ReactNode }) => (
	<div
		style={{
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			minWidth: 0,
		}}
	>
		{children}
	</div>
);

export default Truncate;
