import styles from "./footer.module.css";
export default function Footer() {
  return (
    <footer className={styles["app-footer"]}>
      &copy; {new Date().getFullYear()} All Rights Reserved.
    </footer>
  );
}
