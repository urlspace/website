import { useState } from "react";
import { Button } from "../Button/Button";
import Form from "../Form/Form";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await env.EMAILS.put(data.email, new Date().toISOString());
    return { success: true };
  });

function FormJoin() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (done) {
    return (
      <p>
        Thanks for joining the waitlist! I will let you know when it is ready
        very soon!
      </p>
    );
  }

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await subscribeEmail({ data: { email } });
          setDone(true);
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
  );
}

export default FormJoin;
