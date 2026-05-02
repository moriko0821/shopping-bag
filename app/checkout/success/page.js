"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useBasket } from "../../context/BasketContext";
import styles from "./page.module.css";

export default function SuccessPage() {
  const { emptyBasket, items } = useBasket();
  // 1回だけ実行するためのフラグ (再レンダリングを発生させないので useRef を使う)
  const hasCleared = useRef(false);

  useEffect(() => {
    if (items.length > 0 && !hasCleared.current) {
      emptyBasket();
      hasCleared.current = true;
    }
  }, [items, emptyBasket]);

  return (
    <div className={styles.success}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>✓</div>
          <h1>Thank you for your order!</h1>
          <p className={styles.message}>
            Your payment was successful and your order is now being processed.
          </p>
          <p className={styles["sub-message"]}>
            A confirmation email will be sent to you shortly.
          </p>
          <div className={styles.actions}>
            <Link href="/products">
              <button>Continue Shopping</button>
            </Link>
            <Link href="/">
              <button className="outline">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
