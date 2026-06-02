// import { Heading, Stack } from "#/components";
import { Stack, Intro } from "#/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
	component: App,
});

function App() {
	return (
		<Stack gap={2}>
			<Intro />

			{
				//   <Heading level={2} text="What people say" />
				//     <section className="feedback">
				//
				//   {Array.from({ length: 10 }).map((_, i) => (
				//     // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
				//     <article key={i}>
				//       <Stack>
				//         <p>
				//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
				//           id perspiciatis aliquid ipsum vel iusto tenetur nisi est hic
				//           error iure earum aspernatur incidunt nihil consequuntur et
				//           qui, at itaque?
				//         </p>
				//         <div>
				//           <span>Some name here</span>
				//           <span>Some role here</span>
				//         </div>
				//       </Stack>
				//     </article>
				//   ))}
				// </section>
			}
		</Stack>
	);
}
