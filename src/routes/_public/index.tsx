import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: App,
});

function App() {
  return (
    <>
      <section className="banner">
        <h1>url.space</h1>
        <p>
          Keep, organise and share websites you like. Open source, no ads, no
          tracking, no AI, just a space for your URLs. Free for everyday use
          with power user features for a tiny fee.
        </p>
        <Link to="/auth/signup">Sign up</Link>
      </section>
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
