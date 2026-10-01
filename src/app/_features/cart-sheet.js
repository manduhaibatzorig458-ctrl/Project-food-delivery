"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Map,
  Minus,
  Plus,
  ShoppingCart,
  Utensils,
  X,
} from "lucide-react";

import { useCart } from "@/app/(provider)/cart-provider";
import { backend } from "@/app/_api/api";

const DELIVERY_FEE = 0.99;

function money(price) {
  return `$${price.toFixed(2)}`;
}

// Backend order-ийг UI-д хэрэгтэй хэлбэрт оруулна
function formatOrder(order) {
  const id = String(order._id || order.id || "");

  return {
    key: id,
    id: order.orderNumber || id.slice(-5).toUpperCase(),
    total: Number(order.totalPrice || order.total || 0),
    status: String(order.status || "PENDING").toLowerCase(),
    createdAt: order.createdAt,
    address: order.address || order.user?.address || "",

    items: (order.foodOrderItems || []).map((item, index) => ({
      id: item.food?._id || item._id || index,
      name: item.food?.name || item.name || "Food",
      quantity: item.quantity,
    })),
  };
}

function formatDate(date) {
  const d = new Date(date);

  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function CartSheet({
  loginHref = "/auth/login",
  signupHref = "/auth/signup",
}) {
  const {
    items,
    total,
    address,
    isOpen,
    closeCart,
    changeQuantity,
    removeItem,
    setAddress,
    placeOrder,
  } = useCart();

  const sheetRef = useRef(null);
  const loginRef = useRef(null);
  const successRef = useRef(null);
  const addressRef = useRef(null);

  const [tab, setTab] = useState("cart");

  const [removeItemData, setRemoveItemData] = useState(null);

  const [addressError, setAddressError] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const hasItems = items.length > 0;


  // Load orders
  async function loadOrders() {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setOrders([]);
      setNeedsLogin(true);
      return;
    }

    setNeedsLogin(false);
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const response = await backend.get("/orders/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];

      setOrders(data.map(formatOrder));
    } catch (error) {
      console.error("Load orders failed:", error);

      if (error.response?.status === 401) {
        setOrders([]);
        setNeedsLogin(true);
      } else {
        setOrdersError("Could not load your orders.");
      }
    }

    setOrdersLoading(false);
  }

  // Order tab нээгдэхэд orders авна
  useEffect(() => {
    if (isOpen && tab === "order") {
      loadOrders();
    }
  }, [isOpen, tab]);

  // Dialog open / close
  useEffect(() => {
    const dialog = sheetRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = loginRef.current;

    if (!dialog) return;

    if (showLogin && !dialog.open) {
      dialog.showModal();
    }

    if (!showLogin && dialog.open) {
      dialog.close();
    }
  }, [showLogin]);

  useEffect(() => {
    const dialog = successRef.current;

    if (!dialog) return;

    if (showSuccess && !dialog.open) {
      dialog.showModal();
    }

    if (!showSuccess && dialog.open) {
      dialog.close();
    }
  }, [showSuccess]);

  // Address
  function handleAddress(e) {
    const value = e.target.value;

    setAddress(value);

    if (value.trim()) {
      setAddressError(false);
    }
  }


  // Remove item
  function confirmRemove() {
    if (removeItemData) {
      removeItem(removeItemData.id);
    }

    setRemoveItemData(null);
  }

  // Checkout
  async function checkout() {
    // Address байхгүй бол
    if (!address.trim()) {
      setAddressError(true);
      addressRef.current?.focus();
      return;
    }

    // Login хийгээгүй бол
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setShowLogin(true);
      return;
    }

    const orderData = {
      foodOrderItems: items.map((item) => ({
        food: item.id,
        quantity: item.quantity,
      })),
      address: address.trim(),
    };

    setLoading(true);
    setOrderError("");

    try {
      // Backend рүү order явуулна
      await backend.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Амжилттай
      setShowSuccess(true);
      setAddressError(false);

      // Cart цэвэрлэнэ
      placeOrder({
        address: address.trim(),
        total: total + DELIVERY_FEE,
      });

      setAddress("");

      // Order history шинэчилнэ
      loadOrders();
    } catch (error) {
      console.error("Order failed:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setShowLogin(true);
      } else {
        setOrderError(
          error.response?.data?.message ||
            "Could not place your order. Please try again.",
        );
      }
    }

    setLoading(false);
  }

  // Back to home
  function backHome() {
    setShowSuccess(false);
    closeCart();
  }

  function goToAuth() {
    setShowLogin(false);
    closeCart();
  }

  return (
    <>
   {/* card sheet */}
      <dialog
        ref={sheetRef}
        onClose={() => {
          setRemoveItemData(null);
          closeCart();
        }}
        onClick={(e) => {
          if (e.target === sheetRef.current) {
            closeCart();
          }
        }}
        className="fixed left-auto right-0 top-0 m-0 h-dvh w-[min(420px,100vw)] max-w-none overflow-hidden bg-neutral-700 p-0 text-neutral-900 backdrop:bg-black/50"
      >
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
          {/* Header */}
          <div className="flex items-center justify-between text-white">
            <h2 className="flex items-center gap-3 text-lg font-semibold">
              <ShoppingCart className="size-5" />
              Order detail
            </h2>

            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 hover:bg-neutral-600"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-full bg-white p-0.5">
            <button
              type="button"
              onClick={() => setTab("cart")}
              className={`rounded-full py-2 text-sm ${
                tab === "cart" ? "bg-[#e0483d] text-white" : "text-neutral-900"
              }`}
            >
              Cart
            </button>

            <button
              type="button"
              onClick={() => setTab("order")}
              className={`rounded-full py-2 text-sm ${
                tab === "order" ? "bg-[#e0483d] text-white" : "text-neutral-900"
              }`}
            >
              Order
            </button>
          </div>

          {/* ORDER HISTORY */}
          {tab === "order" ? (
            <section className="rounded-2xl bg-white p-4">
              <h3 className="mb-3 text-base font-semibold">Order history</h3>

              {needsLogin ? (
                <p className="py-6 text-center text-sm text-neutral-600">
                  Log in to see your orders.
                </p>
              ) : ordersLoading ? (
                <p className="py-6 text-center text-sm text-neutral-600">
                  Loading...
                </p>
              ) : ordersError ? (
                <p className="py-6 text-center text-sm text-[#e0483d]">
                  {ordersError}
                </p>
              ) : orders.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-600">
                  No orders yet.
                </p>
              ) : (
                <div>
                  {orders.map((order) => (
                    <div
                      key={order.key}
                      className="border-b border-dashed border-neutral-300 py-4"
                    >
                      {/* Price + status */}
                      <div className="flex justify-between">
                        <p className="text-sm font-semibold">
                          {money(order.total)}{" "}
                          <span className="font-normal">(#{order.id})</span>
                        </p>

                        <span className="rounded-full border border-[#e0483d] px-2.5 py-0.5 text-[11px] text-[#e0483d]">
                          {order.status === "delivered"
                            ? "Delivered"
                            : "Pending"}
                        </span>
                      </div>

                      {/* Foods */}
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="mt-2 flex justify-between text-xs text-neutral-500"
                        >
                          <span className="flex items-center gap-2">
                            <Utensils className="size-3.5" />
                            {item.name}
                          </span>

                          <span>x {item.quantity}</span>
                        </div>
                      ))}

                      {/* Date */}
                      <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="size-3.5" />
                        {formatDate(order.createdAt)}
                      </p>

                      {/* Address */}
                      <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                        <Map className="size-3.5" />
                        <span className="truncate">{order.address}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* MY CART */}
              <section className="rounded-2xl bg-white p-4">
                <h3 className="mb-3 text-base font-semibold text-neutral-500">
                  My cart
                </h3>

                {hasItems ? (
                  <div>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b border-dashed border-neutral-300 py-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[100px] w-[100px] rounded-lg object-cover"
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          {/* Name + remove */}
                          <div className="flex justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-[#e0483d]">
                                {item.name}
                              </p>

                              {item.description && (
                                <p className="mt-1 line-clamp-2 text-[11px] text-neutral-500">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => setRemoveItemData(item)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e0483d] text-[#e0483d]"
                            >
                              <X className="size-4" />
                            </button>
                          </div>

                          {/* Quantity + price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  changeQuantity(item.id, item.quantity - 1)
                                }
                                className="disabled:opacity-30"
                              >
                                <Minus className="size-4" />
                              </button>

                              <span className="w-4 text-center text-sm">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>

                            <span className="text-sm font-bold">
                              {money(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty cart */
                  <div className="rounded-xl bg-neutral-100 px-6 py-8 text-center">
                    <img
                      src="/Logo.png"
                      alt=""
                      className="mx-auto mb-2 h-14 w-14"
                    />

                    <p className="text-sm font-semibold">Your cart is empty</p>

                    <p className="text-xs text-neutral-500">
                      Add some delicious dishes to your cart and satisfy your
                      cravings!
                    </p>
                  </div>
                )}

                {/* Delivery location */}
                <h3 className="mb-2 mt-6 text-base font-semibold text-neutral-500">
                  Delivery location
                </h3>

                <textarea
                  ref={addressRef}
                  value={address}
                  onChange={handleAddress}
                  onBlur={() => {
                    if (!address.trim()) {
                      setAddressError(true);
                    }
                  }}
                  placeholder={
                    addressError
                      ? "Please complete your address"
                      : "Please share your complete address"
                  }
                  rows={2}
                  className={`w-full resize-none rounded-md border px-3 py-2.5 text-sm outline-none ${
                    addressError ? "border-[#e0483d]" : "border-neutral-200"
                  }`}
                />

                {addressError && (
                  <p className="mt-1 text-xs text-[#e0483d]">
                    Please complete your address
                  </p>
                )}
              </section>

              {/*  PAYMENT */}
              <section className="rounded-2xl bg-white p-4">
                <h3 className="mb-3 text-base font-semibold text-neutral-500">
                  Payment info
                </h3>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Items</span>

                    <span className="font-bold">
                      {hasItems ? money(total) : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>

                    <span className="font-bold">
                      {hasItems ? money(DELIVERY_FEE) : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-dashed border-neutral-300 pt-3">
                    <span className="text-neutral-500">Total</span>

                    <span className="font-bold">
                      {hasItems ? money(total + DELIVERY_FEE) : "-"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  disabled={!hasItems || loading}
                  className="mt-4 h-11 w-full rounded-full bg-[#e0483d] text-sm text-white disabled:opacity-50"
                >
                  {loading ? "Placing order..." : "Checkout"}
                </button>

                {orderError && (
                  <p className="mt-2 text-center text-xs text-[#e0483d]">
                    {orderError}
                  </p>
                )}
              </section>
            </>
          )}

          {/* REMOVE CONFIRMATION */}
          {removeItemData && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-6">
              <div className="w-full rounded-2xl bg-white p-5">
                <p className="text-base font-semibold">
                  Remove {removeItemData.name}?
                </p>

                <p className="mt-1 text-sm text-neutral-600">
                  It will be taken out of your cart.
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRemoveItemData(null)}
                    className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm"
                  >
                    Keep
                  </button>

                  <button
                    type="button"
                    onClick={confirmRemove}
                    className="rounded-full bg-[#e0483d] px-4 py-1.5 text-sm text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>

      {/* LOGIN DIALOG */}
      <dialog
        ref={loginRef}
        onClose={() => setShowLogin(false)}
        onClick={(e) => {
          if (e.target === loginRef.current) {
            setShowLogin(false);
          }
        }}
        className="m-auto w-[min(460px,92vw)] rounded-3xl bg-white p-6 backdrop:bg-black/60"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">You need to log in first</h2>

          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link
            href={loginHref}
            onClick={goToAuth}
            className="flex h-10 items-center justify-center rounded-md bg-neutral-900 text-sm text-white"
          >
            Log in
          </Link>

          <Link
            href={signupHref}
            onClick={goToAuth}
            className="flex h-10 items-center justify-center rounded-md border border-neutral-200 text-sm"
          >
            Sign up
          </Link>
        </div>
      </dialog>

      {/* SUCCESS DIALOG */}
      <dialog
        ref={successRef}
        onClose={() => setShowSuccess(false)}
        onClick={(e) => {
          if (e.target === successRef.current) {
            setShowSuccess(false);
          }
        }}
        className="m-auto w-[min(460px,92vw)] rounded-3xl bg-white p-8 text-center backdrop:bg-black/60"
      >
        <h2 className="text-xl font-semibold">
          Your order has been successfully placed!
        </h2>

        <div className="mx-auto my-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#e0483d] text-white">
          <Check className="size-12" />
        </div>

        <Link
          href="/"
          onClick={backHome}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-6 text-sm"
        >
          Back to home
        </Link>
      </dialog>
    </>
  );
}
