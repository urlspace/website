import { createFileRoute } from "@tanstack/react-router";

import appleShortcutsDarkAvif from "#/assets/images/apple-shortcuts-dark.avif";
import appleShortcutsDarkPng from "#/assets/images/apple-shortcuts-dark.png";
import appleShortcutsDarkWebp from "#/assets/images/apple-shortcuts-dark.webp";
import appleShortcutsLightAvif from "#/assets/images/apple-shortcuts-light.avif";
import appleShortcutsLightPng from "#/assets/images/apple-shortcuts-light.png";
import appleShortcutsLightWebp from "#/assets/images/apple-shortcuts-light.webp";
import { Heading, Page, Toc } from "#/components/index.ts";
import useTheme from "#/hooks/useTheme.ts";

export const Route = createFileRoute(
	"/_public/documentation/integrations/apple-shortcuts",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Apple Shortcuts | url.space",
			},
		],
	}),
});

function App() {
	const [theme] = useTheme();
	const darkMedia =
		theme === "system" ? "(prefers-color-scheme: dark)" : undefined;

	return (
		<Page.Main>
			<Heading level={1} text="Apple Shortcuts" />
			<p>
				If you use Apple devices, Apple Shortcuts may be the quickest way to add
				a link to your url.space account. They hook into the share sheet, so you
				can save a link from anything that has a URL, on macOS, iPadOS, and iOS.
				These shortcuts is compatible only with MacOS, iPadOS and iOS versoin
				27+.
			</p>
			<p>
				The first time you run a shortcut, it asks for an API token. The
				shortcut uses the token to reach the url.space API without your
				password. To create one, go to "Access tokens" in your settings and
				click "Create token".
			</p>
			<Toc>
				<ul>
					<li>
						<a href="https://www.icloud.com/shortcuts/f91e235b9e0847fcacf574c877522ac3">
							Apple Shortcut: url.space - Save Link
						</a>
					</li>
					<li>
						<a href="https://www.icloud.com/shortcuts/98494a7c9eef4553b63391ad90b77c9d">
							Apple Shortcut: url.space - For later
						</a>
					</li>
				</ul>
			</Toc>

			<picture>
				{theme !== "light" ? (
					<>
						<source
							srcSet={appleShortcutsDarkAvif}
							type="image/avif"
							media={darkMedia}
						/>
						<source
							srcSet={appleShortcutsDarkWebp}
							type="image/webp"
							media={darkMedia}
						/>
						<source srcSet={appleShortcutsDarkPng} media={darkMedia} />
					</>
				) : null}
				<source srcSet={appleShortcutsLightAvif} type="image/avif" />
				<source srcSet={appleShortcutsLightWebp} type="image/webp" />
				<img
					src={appleShortcutsLightPng}
					width={3060}
					height={3036}
					alt="The url.space Save link and For later shortcuts in the Shortcuts app and in the iOS share sheet"
				/>
			</picture>
		</Page.Main>
	);
}
