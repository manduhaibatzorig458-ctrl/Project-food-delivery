"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Clock, Map, Minus, Plus, ShoppingCart, Utensils, X } from "lucide-react";
import { useCart } from "@/app/(provider)/cart-provider";
import { backend } from "@/app/_api/api";

const DELIVERY_FEE_CENTS = 99;
const money = (cents) => `$${(cents / 100).toFixed(2)}`;

function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

// isLoggedIn ogoogui bol localStorage-iin "token"-oor shalgana (checkout darah uyd shine).
export default function CartSheet({
  isLoggedIn,
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
    orders,
    placeOrder,
  } = useCart();

  const sheetRef = useRef(null);
  const loginRef = useRef(null);
  const successRef = useRef(null);
  const addressRef = useRef(null);

  const [tab, setTab] = useState("cart");
  const [pendingRemove, setPendingRemove] = useState(null); // ustgahyn umnu asuuh mor
  const [addressError, setAddressError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Native <dialog>: Esc, focus trap, backdrop-iig browser hiine.
  useEffect(() => {
    const dialog = sheetRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = loginRef.current;
    if (!dialog) return;
    if (showLogin && !dialog.open) dialog.showModal();
    else if (!showLogin && dialog.open) dialog.close();
  }, [showLogin]);

  useEffect(() => {
    const dialog = successRef.current;
    if (!dialog) return;
    if (showSuccess && !dialog.open) dialog.showModal();
    else if (!showSuccess && dialog.open) dialog.close();
  }, [showSuccess]);

  // Ene dugnelt zuvhun harahad zoriulsan. Server oor tootsoolj, ene toog ignore hiine.
  const hasItems = items.length > 0;
  const itemsCents = Math.round(total * 100);
  const feeCents = hasItems ? DELIVERY_FEE_CENTS : 0;
  const sumCents = itemsCents + feeCents;

  function handleAddressChange(e) {
    const value = e.target.value;
    setAddress(value);
    if (value.trim()) setAddressError(false);
  }

  function confirmRemove() {
    if (pendingRemove) removeItem(pendingRemove.id);
    setPendingRemove(null);
  }

  async function handleCheckout() {
    const loggedIn = isLoggedIn ?? Boolean(localStorage.getItem("token"));
    if (!loggedIn) {
      setShowLogin(true);
      return;
    }
    if (!address.trim()) {
      setAddressError(true);
      addressRef.current?.focus();
      return;
    }
    const cleanAddress = address.trim();
    // Une/dun ilgeehgui: server oor tootsoolno. Zuvhun ymar hool, hed, haana gedgiig ilgeene.
    const payload = {
      // Admin huudas foodOrderItems[{ food, quantity }] gej unshdag tul ijil butetstei ilgeene.
      foodOrderItems: items.map(({ id, quantity }) => ({ food: id, quantity })),
      address: cleanAddress,
    };
    console.log(payload);

    setSubmitting(true);
    setOrderError("");
    try {
      await backend.post("/orders", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Server hadgalsnii daraa l cart-iig tseverlene ba history-d nemne.
      placeOrder({ address: cleanAddress, total: sumCents / 100 });
      setShowSuccess(true);
    } catch (error) {
      console.error("Order failed:", error);
      setOrderError(
        error.response?.data?.message || "Could not place your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function backToHome() {
    setShowSuccess(false);
    closeCart();
  }

  // Log in / Sign up ruu shiljihed sheet ba dialog-iig haana.
  function leaveToAuth() {
    setShowLogin(false);
    closeCart();
  }

  return (
    <>
      <dialog
        ref={sheetRef}
        onClose={() => {
          setPendingRemove(null);
          closeCart();
        }}
        onClick={(e) => {
          if (e.target === sheetRef.current) closeCart();
        }}
        aria-label="Order detail"
        className="fixed right-0 top-0 left-auto my-0 mr-0 ml-auto h-dvh max-h-none w-[min(420px,100vw)] max-w-none overflow-hidden bg-neutral-700 p-0 text-neutral-900 backdrop:bg-black/50"
      >
        <div className="relative flex h-full flex-col gap-4 overflow-y-auto p-5">
          {/* Header */}
          <div className="flex items-center justify-between text-white">
            <h2 className="flex items-center gap-3 text-lg font-semibold">
              <ShoppingCart className="size-5" />
              Order detail
            </h2>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 hover:bg-neutral-600"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-full bg-white p-0.5 text-sm font-medium" role="tablist">
            {["cart", "order"].map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-full py-2 capitalize ${
                  tab === t ? "bg-[#e0483d] text-white" : "text-neutral-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "order" ? (
            <section className="rounded-2xl bg-white p-4">
              <h3 className="mb-3 text-base font-semibold">Order history</h3>
              {orders.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-600">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-dashed divide-neutral-300">
                  {orders.map((order) => (
                    <li key={order.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          {money(Math.round(order.total * 100))}{" "}
                          <span className="font-normal">(#{order.id})</span>
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            order.status === "delivered"
                              ? "bg-neutral-200 text-neutral-700"
                              : "border border-[#e0483d] text-[#e0483d]"
                          }`}
                        >
                          {order.status === "delivered" ? "Delivered" : "Pending"}
                        </span>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="flex items-center gap-2">
                            <Utensils className="size-3.5" />
                            {item.name}
                          </span>
                          <span>x {item.quantity}</span>
                        </div>
                      ))}
                      <p className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="size-3.5 shrink-0" />
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-neutral-500">
                        <Map className="size-3.5 shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : (
            <>
              {/* My cart + delivery location */}
              <section className="rounded-2xl bg-white p-4">
                <h3 className="mb-3 text-base font-semibold text-neutral-500">My cart</h3>

                {hasItems ? (
                  <ul className="divide-y divide-dashed divide-neutral-300">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-3 py-3 first:pt-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[100px] w-[100px] shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-[#e0483d]">{item.name}</p>
                            <button
                              type="button"
                              onClick={() => setPendingRemove(item)}
                              aria-label={`Remove ${item.name}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e0483d] text-[#e0483d]"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => changeQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="disabled:opacity-30"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => changeQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                            <span className="text-sm font-bold">
                              {money(Math.round(item.price * 100) * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-neutral-100 px-6 py-8 text-center">
                    <img src="/Logo.png" alt="" className="mb-2 h-14 w-14 object-contain" />
                    <p className="text-sm font-semibold">Your cart is empty</p>
                    <p className="text-xs text-neutral-500">
                      Add some delicious dishes to your cart and satisfy your cravings!
                    </p>
                  </div>
                )}

                <h3 className="mb-2 mt-6 text-base font-semibold text-neutral-500">Delivery location</h3>
                <textarea
                  ref={addressRef}
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Please share your complete address"
                  rows={3}
                  aria-invalid={addressError}
                  aria-describedby={addressError ? "address-error" : undefined}
                  className={`w-full resize-none rounded-md border p-2 text-sm outline-none ${
                    addressError
                      ? "border-[#e0483d] focus:border-[#e0483d]"
                      : "border-neutral-200 focus:border-neutral-500"
                  }`}
                />
                {addressError && (
                  <p id="address-error" role="alert" className="mt-1 text-xs text-[#e0483d]">
                    Please complete your address
                  </p>
                )}
              </section>

              {/* Payment info */}
              <section className="rounded-2xl bg-white p-4">
                <h3 className="mb-3 text-base font-semibold text-neutral-500">Payment info</h3>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Items</dt>
                    <dd className="font-bold">{hasItems ? money(itemsCents) : "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Shipping</dt>
                    <dd className="font-bold">{hasItems ? money(feeCents) : "-"}</dd>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-dashed border-neutral-300 pt-3">
                    <dt className="text-neutral-500">Total</dt>
                    <dd className="font-bold">{hasItems ? money(sumCents) : "-"}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!hasItems || submitting}
                  className="mt-4 h-11 w-full rounded-full bg-[#e0483d] text-sm text-white disabled:opacity-50"
                >
                  {submitting ? "Placing order..." : "Checkout"}
                </button>
                {orderError && (
                  <p role="alert" className="mt-2 text-center text-xs text-[#e0483d]">
                    {orderError}
                  </p>
                )}
              </section>
            </>
          )}

          {/* Confirm remove */}
          {pendingRemove && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 p-6">
              <div role="alertdialog" aria-labelledby="remove-title" className="w-full rounded-2xl bg-white p-5">
                <p id="remove-title" className="text-base font-semibold">
                  Remove {pendingRemove.name}?
                </p>
                <p className="mt-1 text-sm text-neutral-600">It will be taken out of your cart.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setPendingRemove(null)}
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

      {/* Login required: sheet-iin sibling (dotor n bish) baihaar ni backdrop click bubble hiihgui */}
      <dialog
        ref={loginRef}
        onClose={() => setShowLogin(false)}
        onClick={(e) => {
          if (e.target === loginRef.current) setShowLogin(false);
        }}
        aria-labelledby="login-required-title"
        className="m-auto w-[min(460px,92vw)] rounded-3xl bg-white p-6 backdrop:bg-black/60"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="login-required-title" className="text-xl font-semibold">
            You need to log in first
          </h2>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link
            href={loginHref}
            onClick={leaveToAuth}
            className="flex h-10 items-center justify-center rounded-md bg-neutral-900 text-sm text-white hover:bg-neutral-800"
          >
            Log in
          </Link>
          <Link
            href={signupHref}
            onClick={leaveToAuth}
            className="flex h-10 items-center justify-center rounded-md border border-neutral-200 text-sm hover:bg-neutral-100"
          >
            Sign up
          </Link>
        </div>
      </dialog>

      {/* Order placed: sibling dialog, sheet-iin ard haragdana */}
      <dialog
        ref={successRef}
        onClose={() => setShowSuccess(false)}
        onClick={(e) => {
          if (e.target === successRef.current) setShowSuccess(false);
        }}
        aria-labelledby="order-success-title"
        className="m-auto w-[min(460px,92vw)] rounded-3xl bg-white p-8 text-center backdrop:bg-black/60"
      >
        <h2 id="order-success-title" className="text-xl font-semibold">
          Your order has been successfully placed!
        </h2>
        {/* Placeholder: ooriin illustration (balloon-toi hun) zurgaar solino uu */}
        <div className="mx-auto my-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#e0483d] text-white">
          <Check className="size-12" strokeWidth={2.5} />
        </div>
        <Link
          href="/"
          onClick={backToHome}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-6 text-sm hover:bg-neutral-200"
        >
          Back to home
        </Link>
      </dialog>
    </>
  );
}