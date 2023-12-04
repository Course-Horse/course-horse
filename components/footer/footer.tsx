import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={`container-xl ${styles.footer}`}>
      <div>
        <p>Section 1</p>
      </div>
      <div>
        <p>Section 2</p>
      </div>
      <div>
        <p>Section 3</p>
      </div>
    </footer>
  );
}
