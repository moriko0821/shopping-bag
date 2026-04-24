import Image from "next/image";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Image src="/hero.jpg" alt="hero image" width={1438} height={527} />
    </div>
  );
}
