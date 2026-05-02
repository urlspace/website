import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/features")({
	component: App,
});

const content = {
	en: { title: "Features" },
	pl: { title: "Funkcje" },
};

function App() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	return <p>{t.title}</p>;
}
