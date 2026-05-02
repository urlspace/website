import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/blog")({
	component: App,
});

const content = {
	en: { title: "Blog" },
	pl: { title: "Blog" },
};

function App() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	return <p>{t.title}</p>;
}
