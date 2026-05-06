import { ButtonLink } from "#/components";
import { Intro } from "#/sections";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: App,
});

function App() {
  return (
    <>
      <Intro />

      <h2 className="section__title">What people say</h2>
      <section className="feedback">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
          <article key={i}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
              perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error
              iure earum aspernatur incidunt nihil consequuntur et qui, at
              itaque?
            </p>
            <div>
              <span>Some name here</span>
              <span>Some role here</span>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
