import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/blog")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Blog | url.space",
			},
		],
	}),
});

function App() {
	return <p>Blog</p>;
}
