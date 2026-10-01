"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/(provider)/cart-provider";

export default function FoodDetailDialog({ food, open, onClose, onAdded }) {
  const dialogRef = useRef(null);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  // Dialog нээх / хаах
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      setQuantity(1);
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!food) return null;

  const total = food.price * quantity;

  const ingredients = Array.isArray(food.ingredients)
    ? food.ingredients.join(", ")
    : "";

  // Cart-д нэмэх
  function handleAdd() {
    addItem(food, quantity);

    onAdded?.();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      className="m-auto w-[min(860px,92vw)] overflow-hidden rounded-3xl bg-white p-0 backdrop:bg-black/60"
    >
      <div className="relative grid gap-6 p-6 md:grid-cols-2">
        {/* Food image */}
        <img
          src={food.image}
          alt={food.name}
          className="h-64 w-full rounded-2xl object-cover md:h-full md:min-h-[360px]"
        />

        {/* Food information */}
        <div className="flex flex-col">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100"
          >
            ✕
          </button>

          {/* Name */}
          <h2 className="pr-12 text-3xl font-semibold text-red-500">
            {food.name}
          </h2>

          {/* Description */}
          <p className="mt-4 text-neutral-900">{food.description}</p>

          {/* Ingredients */}
          {ingredients && (
            <p className="mt-3 text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">Ingredients:</span>{" "}
              {ingredients}
            </p>
          )}

          {/* Bottom */}
          <div className="mt-auto pt-8">
            {/* Price + quantity */}
            <div className="flex items-end justify-between">
              {/* Total price */}
              <div>
                <p className="text-neutral-900">Total price</p>

                <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                  disabled={quantity === 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-lg disabled:opacity-40"
                >
                  −
                </button>

                <span className="w-4 text-center font-medium">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-900 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 h-12 w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
