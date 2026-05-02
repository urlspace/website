import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/pricing")({
	component: App,
});

const content = {
	en: { title: "Pricing" },
	pl: { title: "Cennik" },
};

function App() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	return <p>{t.title}</p>;
}
