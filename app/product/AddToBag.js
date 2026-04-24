"use client";
import { useState } from "react";
import { useBasket } from "../context/BasketContext";
import styles from "./addToBag.module.css";

export default function AddToBag({ product }) {
  const { addToBag, removeFromBag, items, updateQuantity } = useBasket();
  const itemInBag = items.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(itemInBag ? itemInBag.quantity : 1);
  console.log(itemInBag);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
    if (itemInBag) {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className={styles["add-to-bag"]}>
      <div className={styles.quantity}>
        <button
          className="minimal"
          disabled={quantity <= 1}
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          -
        </button>
        <input disabled value={quantity} />
        <button
          className="minimal"
          disabled={quantity >= product.stock}
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>
      {itemInBag ? (
        <div className={styles.actions}>
          <p>Added to basket!</p>
          <button onClick={() => removeFromBag(product.id)} className="outline">
            Remove
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            addToBag(product, quantity);
          }}
        >
          Add to bag
        </button>
      )}
    </div>
  );
}
