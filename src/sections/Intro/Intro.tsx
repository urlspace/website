import { ButtonLink, Heading, Stack } from "#/components";
import "./Intro.css";

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
            <ButtonLink text="Sign up" to="/auth/signup" />
          </Stack>
        </div>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Organise" level={2} />
          <p className="intro__description">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
          </p>
          <a href="#" className="intro__more">
            Organisation with ease
          </a>
        </Stack>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Share" level={2} />
          <p className="intro__description">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
          </p>
          <a href="#" className="intro__more">
            Lean more about sharing
          </a>
        </Stack>
      </div>
      <div className="intro__feature">
        <Stack>
          <Heading text="Use everywhere" level={2} />
          <p className="intro__description">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
          </p>
          <a href="#" className="intro__more">
            Explore integrations
          </a>
        </Stack>
      </div>
    </section>
  );
}

export default Intro;
