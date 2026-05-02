import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({ component: App });

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
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde id
            perspiciatis aliquid ipsum vel iusto tenetur nisi est hic error iure
            earum aspernatur incidunt nihil consequuntur et qui, at itaque?
          </p>
          <div>
            <span>Name and surname</span>
            <span>Role here</span>
          </div>
        </article>
      </section>
    </>
  );
}
