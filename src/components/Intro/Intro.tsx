import { Heading, Stack } from "#/components";
import styles from "./Intro.module.css";

function Intro() {
  return (
    <div className={styles.intro}>
      <Stack>
        <Heading text="url.space" level={1} />
        <p className={styles.description}>
          A bookmarking service for people who love the web. Save, organise and
          share links. Open source, no ads, no tracking, no AI. Free for
          everyday use, with power-user features for a small fee.
        </p>
      </Stack>
    </div>
  );
}

export default Intro;
