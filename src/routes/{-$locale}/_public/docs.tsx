import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/docs")({
	component: App,
});

const content = {
	en: { title: "Docs" },
	pl: { title: "Dokumentacja" },
};

function App() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	return <p>{t.title}</p>;
}
