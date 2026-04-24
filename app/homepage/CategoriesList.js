import Link from "next/link";
import styles from "./categoriesList.module.css";

export default async function CategoriesList() {
  const data = await fetch("https://dummyjson.com/products/categories");
  const categories = await data.json();
  return (
    <ul className={`${styles.wrapper} container`}>
      {categories.map((category) => (
        <Link key={category.slug} href={`/products/${category.slug}`}>
          <li className={styles.category}>{category.name}</li>
        </Link>
      ))}
    </ul>
  );
}
