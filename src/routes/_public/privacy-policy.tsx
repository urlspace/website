import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Prose } from "#/components/index.ts";

export const Route = createFileRoute("/_public/privacy-policy")({
	component: PrivacyPolicyPage,
	head: () => ({
		meta: [
			{
				title: "Privacy policy | url.space",
			},
		],
	}),
});

function PrivacyPolicyPage() {
	return (
		<Page.Main>
			<Prose>
				<Heading level={1} text="Privacy policy" />
				<p>
					<small>Last updated: 1 December 2026.</small>
				</p>
				<p>
					I'm Pawel Grzybek, the UK-based operator of url.space and controller
					of your personal data. Contact me at{" "}
					<a href="mailto:mail@url.space">mail@url.space</a>.
				</p>
				<ul>
					<li>
						<a href="#what-i-collect">What I collect</a>
					</li>
					<li>
						<a href="#why-i-use-it">Why I use it</a>
					</li>
					<li>
						<a href="#who-can-see-it">Who can see it</a>
					</li>
					<li>
						<a href="#cookies">Cookies</a>
					</li>
					<li>
						<a href="#how-long-i-keep-it">How long I keep it</a>
					</li>
					<li>
						<a href="#your-rights">Your rights</a>
					</li>
				</ul>

				<hr />

				<Heading level={2} text="What I collect" id="what-i-collect" />
				<ul>
					<li>
						<b>Your account:</b> your email address, username, display name and
						password. To create an account, you need to be 16 or over and
						provide an email address, username and password. Your display name
						defaults to your username.
					</li>
					<li>
						<b>What you save:</b> links, their titles and descriptions, tags,
						collections, and passwords for protected collections.
					</li>
					<li>
						<b>Your sign-ins and API tokens:</b> a label for each signed-in
						device, like "Chrome on macOS", and when each API token was last
						used.
					</li>
					<li>
						<b>Your subscription:</b> your plan and renewal date. Polar handles
						payments through Stripe. You enter your card details on their
						checkout, so I never see or store them.
					</li>
					<li>
						<b>Technical logs:</b> for each request, what was asked for, whether
						it worked, how long it took, and your IP address and browser type.
					</li>
				</ul>
				<p>
					No analytics, tracking, fingerprinting or ads. I never sell your data
					or use it for AI training. Connections use HTTPS. Account passwords,
					session credentials and API tokens are stored hashed. Collection
					passwords are stored as plain text so you can view and change them.
					Only I can access the database.
				</p>

				<Heading level={2} text="Why I use it" id="why-i-use-it" />
				<ul>
					<li>
						<b>
							To manage your account, saved links, subscription and account
							emails
						</b>{" "}
						(contract).
					</li>
					<li>
						<b>To block attacks and fix bugs</b> using technical logs
						(legitimate interests).
					</li>
					<li>
						<b>To answer your emails</b> (legitimate interests).
					</li>
				</ul>
				<p>I send account emails only—no newsletters or marketing.</p>

				<Heading level={2} text="Who can see it" id="who-can-see-it" />
				<p>
					<b>Everyone:</b> your public collections, their links, and your
					username and display name. Anyone can follow them via RSS or copy them
					into their own account. Protected collections need their password.
					Everything else is private.
				</p>
				<p>
					<b>Websites you save:</b> my server visits the page to get its title,
					so the site sees url.space, not you. For YouTube and Reddit links,
					their preview service gets your language preference.
				</p>
				<p>Services url.space runs on:</p>
				<ul>
					<li>
						<b>Cloudflare</b> runs the website and protects it from attacks.
					</li>
					<li>
						<b>Railway</b> hosts the server and database in the EU (Amsterdam).
					</li>
					<li>
						<b>Grafana</b> stores the logs in the UK.
					</li>
					<li>
						<b>Resend</b> sends account emails from the EU (Ireland).
					</li>
					<li>
						<b>Apple iCloud</b> hosts the mail@url.space inbox.
					</li>
					<li>
						<b>Polar</b> handles payments as the seller, under{" "}
						<a href="https://polar.sh/legal/privacy">its own privacy policy</a>.
					</li>
				</ul>
				<p>
					Some of these companies are based in the US. Your data is protected
					there either by the company's certification under the UK Extension to
					the EU-US Data Privacy Framework, or by the ICO's International Data
					Transfer Addendum in my agreement with it. The UK treats data stored
					in the EU as adequately protected. Email me for details or a copy of
					the applicable transfer safeguards.
				</p>

				<Heading level={2} text="Cookies" id="cookies" />
				<p>url.space uses these cookies:</p>
				<ul>
					<li>
						<b>session</b> keeps you signed in for 30 days, renewed while you
						use url.space.
					</li>
					<li>
						<b>collection-password</b> remembers a protected collection you've
						unlocked, until you close your browser.
					</li>
					<li>
						<b>collection-layout</b> remembers that you chose masonry view, for
						a year. Switch back to list and it's deleted.
					</li>
					<li>
						<b>theme</b> remembers that you chose light or dark, for a year.
						Switch back to system and it's deleted.
					</li>
				</ul>
				<p>
					Cloudflare may set security cookies to check for bots. A timestamp in
					sessionStorage prevents repeated reloads after updates and lasts for
					the tab session.
				</p>

				<Heading level={2} text="How long I keep it" id="how-long-i-keep-it" />
				<ul>
					<li>
						<b>Your account and everything in it:</b> until you delete it. If I
						ever remove long-unused accounts, I'll email you months before.
					</li>
					<li>
						<b>Unconfirmed sign-ups:</b> 7 days.
					</li>
					<li>
						<b>Confirmation and password reset links:</b> they stop working
						after 15 minutes to 24 hours.
					</li>
					<li>
						<b>Technical logs:</b> 7 days.
					</li>
					<li>
						<b>Emails you send me:</b> up to a year after we last talk.
					</li>
				</ul>
				<p>
					Deleting your account immediately removes its database records and
					cancels your subscription. Logs and support emails follow the
					retention periods above. Copies other users made of your public
					collections remain in their accounts. Polar retains payment records as
					required by law.
				</p>

				<Heading level={2} text="Your rights" id="your-rights" />
				<ul>
					<li>
						<b>Get a copy:</b> email me for everything I hold about you, or
						export your links at any time from Tools as a bookmarks file you can
						import elsewhere. I can also send your data straight to another
						service, where that's technically possible.
					</li>
					<li>
						<b>Correct it</b> in Settings.
					</li>
					<li>
						<b>Delete it</b> in Settings.
					</li>
					<li>
						<b>Limit it:</b> ask me to pause using your data, for example while
						I fix a mistake.
					</li>
					<li>
						<b>Object:</b>{" "}
						<b>
							you can object at any time to how I use your data for security and
							support.
						</b>{" "}
						I'll stop unless I have a strong reason not to, such as an attack.
					</li>
				</ul>
				<p>
					Some rights depend on the situation. If one doesn't apply, I'll tell
					you why. For any of these, or if you're unhappy with how I handle your
					data, email <a href="mailto:mail@url.space">mail@url.space</a>. I'll
					confirm I've received a complaint within 7 days (usually a lot faster)
					and tell you what I've done about it. You can also complain to the{" "}
					<a href="https://ico.org.uk">ICO</a> in the UK or to your local data
					protection authority in the EU.
				</p>
			</Prose>
		</Page.Main>
	);
}
