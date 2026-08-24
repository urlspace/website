import { Heading, Stack } from "#/components";
import { FormJoin } from "#/components/";
import styles from "./Intro.module.css";

function Intro() {
  return (
    <div className={styles.intro}>
      <Stack>
        <Heading text="url.space" level={1} />
        <p className={styles.description}>
          Keep, organise and share websites you like. Open source, no ads, no
          tracking, no AI, just a space for your URLs. Free for everyday use
          with power user features for a tiny fee.
        </p>
        <FormJoin />
      </Stack>
    </div>
  );
}

export default Intro;
