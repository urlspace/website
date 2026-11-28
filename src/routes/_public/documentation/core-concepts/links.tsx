import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Toc } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/core-concepts/links",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Links | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Links" />
			<p>
				It is all about links. A link requires a valid title and URL. A
				description is optional, but it helps you remember why you saved the
				link, especially when you browse links you added years ago. Mark the
				ones closest to your heart as "Favourite" and the ones you saved to come
				back to as "For later". These are the two simple link properties. The
				more advanced ways to organise links, collections and tags, are covered
				on their own pages. The free plan allows up to 1000 links.
			</p>
			<Toc>
				<ul>
					<li>
						<a href="#adding-a-link">Adding a link</a>
					</li>
					<li>
						<a href="#favourites">Favourites</a>
					</li>
					<li>
						<a href="#for-later">For later</a>
					</li>
					<li>
						<a href="#advanced-search-queries">Advanced search queries</a>
					</li>
					<li>
						<a href="#keyboard-shortcuts">
							Navigation using keyboard shortcuts
						</a>
					</li>
				</ul>
			</Toc>
			<hr />
			<Heading level={2} text="Adding a link" id="adding-a-link" />
			<p>
				There are plenty of ways of adding a new link to your space. Hit the
				"Add link" button on the top of the dashboard or on the filters sidebar
				or hit <kbd>n</kbd> on your keyboard for the new link dialog to pop up.
			</p>
			<Heading level={2} text="Favourites" id="favourites" />
			<p>
				Mark the links closest to your heart as favourites. Use the "Favourite"
				button under each link, or press <kbd>f</kbd> while a link is focused.
				To list your favourites, click "Favourite" in the filters sidebar, press{" "}
				<kbd>g</kbd> <kbd>f</kbd> ("go to favourites") or search for
				<code>is:favourite</code>.
			</p>
			<Heading level={2} text="For later" id="for-later" />
			<p>
				"For later" comes in handy for links you want to keep but don't have
				time to read yet. Use the "For later" button under each link, or press{" "}
				<kbd>l</kbd> while a link is focused. To list these links, click "For
				later" in the filters sidebar, press <kbd>g</kbd> <kbd>l</kbd> ("go to
				for later") or search for <code>is:for-later</code>.
			</p>
			<Heading
				level={2}
				text="Advanced search queries"
				id="advanced-search-queries"
			/>
			<p>
				Search filters can be combined. To find your favourite links in the
				"Record Stores" collection, tagged #amsterdam, with "wax" in the title,
				search for{" "}
				<code>is:favourite collection:"Record Stores" #amsterdam wax</code>.
				Typing all this by hand is not the most user-friendly way, but luckily
				the query is generated for you as you interact with filters on the
				sidebar.
			</p>
			<Heading
				level={2}
				text="Navigation using keyboard shortcuts"
				id="keyboard-shortcuts"
			/>
			<p>
				Mastering the keyboard shortcuts takes a while, but it is worth the
				investment. There is no point listing them all here, but remember one
				key <kbd>?</kbd>. Press it to open a dialogue with all the available
				shortcuts. Learn them one by one, and you will soon fly through your
				links.
			</p>
		</Page.Main>
	);
}
