import { Button, ButtonLink, Form, Heading, Stack } from "#/components";
import { Link } from "@tanstack/react-router";
import "./Intro.css";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await env.EMAILS.put(data.email, new Date().toISOString());
    return { success: true };
  });

function Intro() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const email = formData.get("email") as string;
                  try {
                    await subscribeEmail({ data: { email } });
                    form.reset();
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Form.Input
                  name="email"
                  type="email"
                  label="Email"
                  required
                  onChange={setEmail}
                  value={email}
                  placeholder="sylvester@stallone.com"
                ></Form.Input>
                <Button
                  type="submit"
                  text={loading ? "Wait a sec..." : "Join the waitlist"}
                  disabled={loading}
                />
              </Form>
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            consectetur, culpa velit consequatur nihil repellat est harum
            possimus nemo fugiat iste perspiciatis sapiente laudantium! Veniam.
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
