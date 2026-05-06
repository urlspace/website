import { ButtonLink } from "#/components";
import "./Intro.css";

function Intro() {
  return (
    <section className="intro">
      <div className="intro__banner">
        <div className="intro__content">
          <div className="intro__title">
            <h1 className="intro__heading">url.space</h1>
          </div>
          <p className="intro__description">
            Keep, organise and share websites you like. Open source, no ads, no
            tracking, no AI, just a space for your URLs. Free for everyday use
            with power user features for a tiny fee.
          </p>
          <ButtonLink text="Sign up" to="/auth/signup" />
        </div>
      </div>
      <div className="intro__feature">
        <div className="intro__title">
          <h2 className="intro__heading">Organise</h2>
        </div>
        <p className="intro__description">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
          consectetur, culpa velit consequatur nihil repellat est harum possimus
          nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
        </p>
        <a href="#" className="intro__more">
          Organisation with ease
        </a>
      </div>
      <div className="intro__feature">
        <div className="intro__title">
          <h2 className="intro__heading">Share</h2>
        </div>
        <p className="intro__description">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
          consectetur, culpa velit consequatur nihil repellat est harum possimus
          nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
        </p>
        <a href="#" className="intro__more">
          Lean more about sharing
        </a>
      </div>
      <div className="intro__feature">
        <div className="intro__title">
          <h2 className="intro__heading">Use everywhere</h2>
        </div>
        <p className="intro__description">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
          consectetur, culpa velit consequatur nihil repellat est harum possimus
          nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
        </p>
        <a href="#" className="intro__more">
          Explore integrations
        </a>
      </div>
    </section>
  );
}

export default Intro;
