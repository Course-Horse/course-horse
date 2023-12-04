import Link from "next/link";

import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`container-xl`}>
        <div className={styles.section}>
          <p>Course Horse</p>
          <p>
            An online learning platform that connects learners to courses made
            by educators.
          </p>
        </div>
        <div className={styles.section}>
          <p></p>
        </div>
        <div className={styles.section}>
          <p>Developers</p>
          <Link href={`https://github.com/xxmistacruzxx`}>David Cruz</Link>
          <Link href={`https://github.com/TristanKensinger`}>
            Tristan Kensinger
          </Link>
          <Link href={`https://github.com/tylerklane`}>Tyler Lane</Link>
        </div>
      </div>
    </footer>
  );
}
