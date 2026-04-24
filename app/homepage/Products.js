import Link from "next/link";
import styles from "./products.module.css";
import ProductsList from "./ProductsList";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function Products() {
  return (
    <div className={styles.products}>
      <div className={`${styles.wrapper} container`}>
        <h2>Highest Rated Product</h2>
        <p>
          Check out below a curated list of the products that received the
          highest ratings from our customers
        </p>
        <ErrorBoundary fallback="Could not load products, please refresh the page.">
          <ProductsList />
        </ErrorBoundary>
        <Link href="/products">
          <button>View all products</button>
        </Link>
      </div>
    </div>
  );
}
