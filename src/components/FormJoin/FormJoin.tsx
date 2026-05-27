import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form";

const subscribeEmail = createServerFn({ method: "POST" })
	.inputValidator((data: { email: string }) => data)
	.handler(async ({ data }) => {
		await env.EMAILS.put(data.email, new Date().toISOString());
		return { success: true };
	});

function FormJoin() {
	const [done, setDone] = useState(false);
	const [email, setEmail] = useState("");

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
			onSubmit={async (
				e: React.SubmitEvent<HTMLFormElement>,
				{ setError, setLoading }: SubmitHelpers,
			) => {
				e.preventDefault();
				setError(null);
				setLoading(true);
				try {
					await subscribeEmail({ data: { email } });
					setDone(true);
				} catch {
					setError("Something went wrong. Try again in a moment.");
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
			/>
			<Form.Submit text="Join the waitlist" textLoading="Wait a sec..." />
		</Form>
	);
}

export default FormJoin;
