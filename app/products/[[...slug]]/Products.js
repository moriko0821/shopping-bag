import CategoryFilter from "../CategoryFilter";
import PaginatedList from "./PaginatedList";
import styles from "./products.module.css";

export default async function Products({ category }) {
  const data = await fetch(
    `https://dummyjson.com/products${category ? "/category/" + category : ""}?limit=8`,
  );
  const products = await data.json();

  const catData = await fetch("https://dummyjson.com/products/categories");
  const categoies = await catData.json();
  return (
    <div className={`${styles["products-list"]} container`}>
      <CategoryFilter categories={categoies} activeCategory={category} />
      <PaginatedList
        category={category}
        initialProducts={products.products}
        totalProducts={products.total}
      />
    </div>
  );
}
