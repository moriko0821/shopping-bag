"use client";

import Image from "next/image";
import styles from "./header.module.css";
import Link from "next/link";
import BasketCount from "./BasketCount";

export default function Header() {
  return (
    <header className={styles["app-header"]}>
      <div className={`${styles.wrapper} container`}>
        <aside>
          <Link href="/">
            <Image src="/logo.png" alt="Website logo" width={108} height={22} />
          </Link>
        </aside>
        <aside>
          <nav>
            <ul>
              <Link href="/">
                <li>Home</li>
              </Link>
              <Link href="/products">
                <li>Product</li>
              </Link>
              <Link href="/basket">
                <li className={styles.basket}>
                  Shopping Bag
                  <BasketCount />
                </li>
              </Link>
            </ul>
          </nav>
        </aside>
      </div>
    </header>
  );
}
