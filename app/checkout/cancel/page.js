import Link from "next/link";
import styles from "./page.module.css";

export default function CancelPage() {
  return (
    <div className={styles.cancel}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>!</div>
          <h1>Payment Cancelled</h1>
          <p className={styles.message}>
            Your payment was not completed. Don&apos;t worry, your cart items
            are still saved.
          </p>
          <p className={styles["sub-message"]}>
            You can return to your basket and try again anytime.
          </p>
          <div className={styles.actions}>
            <Link href="/basket">
              <button>Return to Basket</button>
            </Link>
            <Link href="/products">
              <button className="outline">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
