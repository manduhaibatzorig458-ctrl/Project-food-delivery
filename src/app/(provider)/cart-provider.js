// "use client";

// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// const CART_KEY = "nomnom:cart";
// const ADDRESS_KEY = "nomnom:address";
// const CartContext = createContext(null);

// function readCart() {
//   try {
//     const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// }

// function readAddress() {
//   try {
//     return localStorage.getItem(ADDRESS_KEY) || "";
//   } catch {
//     return "";
//   }
// }

// export function CartProvider({ children }) {
//   const [items, setItems] = useState([]);
//   const [address, setAddressState] = useState("");
//   const [isOpen, setIsOpen] = useState(false); // cart sheet neegdsen eseh
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setItems(readCart());
//     setAddressState(readAddress());
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       localStorage.setItem(CART_KEY, JSON.stringify(items));
//     } catch {}
//   }, [items, hydrated]);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       if (address.trim()) localStorage.setItem(ADDRESS_KEY, address);
//       else localStorage.removeItem(ADDRESS_KEY);
//     } catch {}
//   }, [address, hydrated]);

//   useEffect(() => {
//     const onStorage = (e) => {
//       if (e.key === CART_KEY) setItems(readCart());
//       if (e.key === ADDRESS_KEY) setAddressState(readAddress());
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   // item: { id, name, price, image }. Adaa id-tai bol neg mor bolj nairlana.
//   const addItem = useCallback((item, quantity = 1) => {
//     const qty = Math.max(1, Math.floor(quantity));
//     setItems((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing) {
//         return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
//       }
//       return [
//         ...prev,
//         { id: item.id, name: item.name, price: item.price, image: item.image, quantity: qty },
//       ];
//     });
//   }, []);

//   const removeItem = useCallback((id) => {
//     setItems((prev) => prev.filter((i) => i.id !== id));
//   }, []);

//   // 1-ees dor bolohgui. Mor ustgahdaa removeItem ashiglana.
//   const changeQuantity = useCallback((id, quantity) => {
//     const qty = Math.max(1, Math.floor(quantity));
//     setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
//   }, []);

//   const clear = useCallback(() => setItems([]), []);
//   const setAddress = useCallback((value) => setAddressState(value), []);
//   const openCart = useCallback(() => setIsOpen(true), []);
//   const closeCart = useCallback(() => setIsOpen(false), []);

//   const value = useMemo(() => {
//     const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
//     const totalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
//     return {
//       items,
//       itemCount,
//       total: totalCents / 100,
//       address,
//       isOpen,
//       hydrated,
//       addItem,
//       removeItem,
//       changeQuantity,
//       clear,
//       setAddress,
//       openCart,
//       closeCart,
//     };
//   }, [items, address, isOpen, hydrated, addItem, removeItem, changeQuantity, clear, setAddress, openCart, closeCart]);

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
//   return ctx;
// }









// "use client";

// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// const CART_KEY = "nomnom:cart";
// const ADDRESS_KEY = "nomnom:address";
// const ORDERS_KEY = "nomnom:orders";
// const FIRST_ORDER_ID = 20156;
// const CartContext = createContext(null);

// function readJSON(key, fallback) {
//   try {
//     const parsed = JSON.parse(localStorage.getItem(key) || "null");
//     return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : parsed ?? fallback;
//   } catch {
//     return fallback;
//   }
// }

// function readAddress() {
//   try {
//     return localStorage.getItem(ADDRESS_KEY) || "";
//   } catch {
//     return "";
//   }
// }

// export function CartProvider({ children }) {
//   const [items, setItems] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [address, setAddressState] = useState("");
//   const [isOpen, setIsOpen] = useState(false); // cart sheet neegdsen eseh
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setItems(readJSON(CART_KEY, []));
//     setOrders(readJSON(ORDERS_KEY, []));
//     setAddressState(readAddress());
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       localStorage.setItem(CART_KEY, JSON.stringify(items));
//     } catch {}
//   }, [items, hydrated]);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
//     } catch {}
//   }, [orders, hydrated]);

//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       if (address.trim()) localStorage.setItem(ADDRESS_KEY, address);
//       else localStorage.removeItem(ADDRESS_KEY);
//     } catch {}
//   }, [address, hydrated]);

//   useEffect(() => {
//     const onStorage = (e) => {
//       if (e.key === CART_KEY) setItems(readJSON(CART_KEY, []));
//       if (e.key === ORDERS_KEY) setOrders(readJSON(ORDERS_KEY, []));
//       if (e.key === ADDRESS_KEY) setAddressState(readAddress());
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   // item: { id, name, price, image }. Adaa id-tai bol neg mor bolj nairlana.
//   const addItem = useCallback((item, quantity = 1) => {
//     const qty = Math.max(1, Math.floor(quantity));
//     setItems((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing) {
//         return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
//       }
//       return [
//         ...prev,
//         { id: item.id, name: item.name, price: item.price, image: item.image, quantity: qty },
//       ];
//     });
//   }, []);

//   const removeItem = useCallback((id) => {
//     setItems((prev) => prev.filter((i) => i.id !== id));
//   }, []);

//   // 1-ees dor bolohgui. Mor ustgahdaa removeItem ashiglana.
//   const changeQuantity = useCallback((id, quantity) => {
//     const qty = Math.max(1, Math.floor(quantity));
//     setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
//   }, []);

//   const clear = useCallback(() => setItems([]), []);
//   const setAddress = useCallback((value) => setAddressState(value), []);
//   const openCart = useCallback(() => setIsOpen(true), []);
//   const closeCart = useCallback(() => setIsOpen(false), []);

//   // Order route baihgui tul tuhain browser-t l hadgalna (server baihgui uyd zuvhun "tuuh").
//   // `total` ni haruulah zoriulalttai; jinhene dung ni server deer tootsoologdono.
//   const placeOrder = useCallback(
//     ({ address: orderAddress, total }) => {
//       const nextId = orders.reduce((max, o) => Math.max(max, o.id), FIRST_ORDER_ID - 1) + 1;
//       const order = {
//         id: nextId,
//         status: "pending", // "pending" | "delivered"
//         createdAt: new Date().toISOString(),
//         address: orderAddress,
//         total,
//         items: items.map(({ id, name, quantity }) => ({ id, name, quantity })),
//       };
//       setOrders((prev) => [order, ...prev]);
//       setItems([]);
//       return order;
//     },
//     [items, orders],
//   );

//   const value = useMemo(() => {
//     const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
//     const totalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
//     return {
//       items,
//       itemCount,
//       total: totalCents / 100,
//       orders,
//       address,
//       isOpen,
//       hydrated,
//       addItem,
//       removeItem,
//       changeQuantity,
//       clear,
//       placeOrder,
//       setAddress,
//       openCart,
//       closeCart,
//     };
//   }, [items, orders, address, isOpen, hydrated, addItem, removeItem, changeQuantity, clear, placeOrder, setAddress, openCart, closeCart]);

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
//   return ctx;
// }



"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "nomnom:cart";
const ADDRESS_KEY = "nomnom:address";
const ORDERS_KEY = "nomnom:orders";
const FIRST_ORDER_ID = 20156;
const CartContext = createContext(null);

function readJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// id-guy (huuchin, buruu) mor hadgalagdsan baival tseverlene: backend 400 ugdug tul.
function readCart() {
  return readJSON(CART_KEY, []).filter((i) => i && i.id);
}

function readAddress() {
  try {
    return localStorage.getItem(ADDRESS_KEY) || "";
  } catch {
    return "";
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [address, setAddressState] = useState("");
  const [isOpen, setIsOpen] = useState(false); // cart sheet neegdsen eseh
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setOrders(readJSON(ORDERS_KEY, []));
    setAddressState(readAddress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (address.trim()) localStorage.setItem(ADDRESS_KEY, address);
      else localStorage.removeItem(ADDRESS_KEY);
    } catch {}
  }, [address, hydrated]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY) setItems(readCart());
      if (e.key === ORDERS_KEY) setOrders(readJSON(ORDERS_KEY, []));
      if (e.key === ADDRESS_KEY) setAddressState(readAddress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // item: { id, name, price, image }. Adaa id-tai bol neg mor bolj nairlana.
  const addItem = useCallback((item, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity));
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, image: item.image, quantity: qty },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // 1-ees dor bolohgui. Mor ustgahdaa removeItem ashiglana.
  const changeQuantity = useCallback((id, quantity) => {
    const qty = Math.max(1, Math.floor(quantity));
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const setAddress = useCallback((value) => setAddressState(value), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Order route baihgui tul tuhain browser-t l hadgalna (server baihgui uyd zuvhun "tuuh").
  // `total` ni haruulah zoriulalttai; jinhene dung ni server deer tootsoologdono.
  const placeOrder = useCallback(
    ({ address: orderAddress, total }) => {
      const nextId = orders.reduce((max, o) => Math.max(max, o.id), FIRST_ORDER_ID - 1) + 1;
      const order = {
        id: nextId,
        status: "pending", // "pending" | "delivered"
        createdAt: new Date().toISOString(),
        address: orderAddress,
        total,
        items: items.map(({ id, name, quantity }) => ({ id, name, quantity })),
      };
      setOrders((prev) => [order, ...prev]);
      setItems([]);
      return order;
    },
    [items, orders],
  );

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
    return {
      items,
      itemCount,
      total: totalCents / 100,
      orders,
      address,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      changeQuantity,
      clear,
      placeOrder,
      setAddress,
      openCart,
      closeCart,
    };
  }, [items, orders, address, isOpen, hydrated, addItem, removeItem, changeQuantity, clear, placeOrder, setAddress, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}