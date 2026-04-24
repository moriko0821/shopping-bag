import { ErrorBoundary } from "./components/ErrorBoundary";
import Categories from "./homepage/Categories";
import Hero from "./homepage/Hero";
import Products from "./homepage/Products";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homepage}>
      <Hero />
      <Categories />
      <Products />
    </div>
  );
}
