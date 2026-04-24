import { ErrorBoundary } from "../components/ErrorBoundary";
import styles from "./categories.module.css";
import CategoriesList from "./CategoriesList";

export default function Categories() {
  return (
    <div className={styles.categories}>
      <h2>Explore Categories</h2>
      <ErrorBoundary fallback="Could not load categories, please refresh the page.">
        <CategoriesList />
      </ErrorBoundary>
    </div>
  );
}
