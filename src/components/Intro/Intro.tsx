import { ButtonLink, Heading, Stack } from "#/components";
import { Link } from "@tanstack/react-router";
import "./Intro.css";
import { FormJoin } from "#/components/";

function Intro() {
  return (
    <section className="intro">
      <div className="intro__banner">
        <div className="intro__content">
          <Stack>
            <Heading text="url.space" level={1} />
            <p className="intro__description">
              Keep, organise and share websites you like. Open source, no ads,
              no tracking, no AI, just a space for your URLs. Free for everyday
              use with power user features for a tiny fee.
            </p>
            {import.meta.env.VITE_BETA ? (
              <FormJoin />
            ) : (
              <ButtonLink text="Sign up" to="/auth/signup" />
            )}
          </Stack>
        </div>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Organise" level={2} />
          <p className="intro__description">
            Internet is full of nonsense and url.space is here to keep the good
            parts. Organise links with tags and collections, and find them with
            powerful search and filters.
          </p>
          <Link to="/docs" className="intro__more">
            Organisation with ease
          </Link>
        </Stack>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Share" level={2} />
          <p className="intro__description">
            Collection is a curated list of links, and sharing is caring, right?
            Share them via a public link, subscribe to the changes via RSS, and
            clone them to your own account.
          </p>
          <Link to="/docs" className="intro__more">
            Lean more about sharing
          </Link>
        </Stack>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Use everywhere" level={2} />
          <p className="intro__description">
            Use the web app for the most powerful experience, add links using
            the browser extension or mobile automations. Tons of third-party
            integrations and if that’s not enough, use the API. Yes, there is a
            CLI, geeks!
          </p>
          <Link to="/docs" className="intro__more">
            Explore integrations
          </Link>
        </Stack>
      </div>
    </section>
  );
}

export default Intro;
