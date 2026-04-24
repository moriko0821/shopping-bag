"use client";
import { createContext, useState, useContext, useEffect } from "react";

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("basket");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(items));
  }, [items]);

  const addToBag = (product, quantity) => {
    setItems((previtems) => {
      if (previtems.find((item) => item.id === product.id)) return previtems;
      return [...previtems, { ...product, quantity }];
    });
  };

  const removeFromBag = (productId) => {
    setItems((previtems) => {
      return previtems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((previtems) => {
      return previtems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
    });
  };

  const emptyBasket = () => {
    setItems([]);
  };

  return (
    <BasketContext.Provider
      value={{ items, removeFromBag, addToBag, updateQuantity, emptyBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  return useContext(BasketContext);
}
