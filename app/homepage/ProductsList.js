import ProductCard from "../components/ProductCard";
import styles from "./productsList.module.css";

export default async function ProductsList() {
  const data = await fetch(
    "https://dummyjson.com/products?limit=12&sortBy=rating&order=desc",
  );
  const products = await data.json();
  return (
    <ul className={styles["products-list"]}>
      {products.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
