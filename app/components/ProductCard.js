import Image from "next/image";
import styles from "./productCard.module.css";
import Link from "next/link";
import { formatPrice } from "../util";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <li className={styles["product-card"]}>
        <Image
          src={product.thumbnail}
          width={256}
          height={256}
          alt={`Image of ${product.title}`}
        />
        <div className={styles.info}>
          <h3>{product.title}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
      </li>
    </Link>
  );
}
