import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Prose } from "#/components";

export const Route = createFileRoute("/_public/terms-of-service")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Terms of service | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Prose>
				<Heading level={1} text="Terms of service" />
				<p>
					<small>Last updated: 1 December 2026.</small>
				</p>
				<p>
					I'm Pawel Grzybek, trading as url.space. Email me at{" "}
					<a href="mailto:mail@url.space">mail@url.space</a> for help or to make
					a complaint.
				</p>

				<Heading level={2} text="Your account and collections" />
				<p>
					You must be 16 or older to create an account. Keep your password and
					access tokens safe. You keep the rights to what you save and give me
					permission to store and show it as needed to run url.space. Anyone can
					view public collections, follow them by RSS or copy them. Copies can
					remain after you remove the original.
				</p>
				<p>
					You can export your bookmarks in Tools or permanently delete your
					account in Settings. Deleting your account ends any active
					subscription and access to Unlimited immediately.
				</p>

				<Heading level={2} text="Safe use and reporting" />
				<p>
					Use url.space lawfully. Keep scams, spam, harmful links and content
					that violates other people's rights off the service. Respect usage
					limits, including when using the API. I may remove content or restrict
					accounts for serious or repeated abuse.
				</p>
				<p>
					Email <a href="mailto:mail@url.space">mail@url.space</a> to report
					illegal or harmful content, raise a safety concern or appeal a
					decision. Include the page address if you have it. I review reports,
					act quickly to remove illegal content and explain the outcome where I
					can.
				</p>

				<Heading level={2} text="Unlimited and billing" id="billing" />
				<p>
					Polar sells Unlimited under{" "}
					<a href="https://polar.sh/legal/checkout-buyer-terms">
						its buyer terms
					</a>
					. Checkout shows your price and billing period. Unlimited renews
					monthly or yearly until you cancel. To stop the next charge, choose
					Manage in Settings before renewal. You keep Unlimited until the end of
					the paid period. Your saved links stay in your account when you move
					to Free, and shared collections go offline.
				</p>
				<p>
					Polar reviews refund requests under its buyer terms and the law. I
					offer no extra refunds for a change of mind. Your legal cancellation
					and refund rights still apply.
				</p>
			</Prose>
		</Page.Main>
	);
}
