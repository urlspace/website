import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/")({
	component: App,
});

const content = {
	en: {
		intro:
			"Keep, organise and share websites you like. Open source, no ads, no tracking, no AI, just a space for your URLs. Free for everyday use with power user features for a tiny fee.",
		signUp: "Sign up",
		quote:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure earum aspernatur incidunt nihil consequuntur et qui, at itaque?",
		name: "Name and surname",
		role: "Role here",
	},
	pl: {
		intro:
			"Zachowuj, organizuj i udostępniaj strony, które lubisz. Open source, bez reklam, bez śledzenia, bez AI — po prostu miejsce na twoje URL-e. Darmowe na co dzień, z funkcjami dla power userów za drobną opłatą.",
		signUp: "Zarejestruj się",
		quote:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure earum aspernatur incidunt nihil consequuntur et qui, at itaque?",
		name: "Imię i nazwisko",
		role: "Stanowisko",
	},
};

function App() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];

	return (
		<>
			<section className="banner">
				<h1>url.space</h1>
				<p>{t.intro}</p>
				<Link to="/{-$locale}/auth/signup" params={{ locale }}>
					{t.signUp}
				</Link>
			</section>
			<section className="feedback">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
					<article key={i}>
						<p>{t.quote}</p>
						<div>
							<span>{t.name}</span>
							<span>{t.role}</span>
						</div>
					</article>
				))}
			</section>
		</>
	);
}
