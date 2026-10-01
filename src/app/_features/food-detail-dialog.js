"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/(provider)/cart-provider";

const formatPrice = (n) => `$${n.toFixed(2)}`;

// Usage: <FoodDetailDialog food={food} open={open} onClose={() => setOpen(false)} />
// food: { id, name, price, image, description, ingredients? (string[]) }
export default function FoodDetailDialog({ food, open, onClose, onAdded }) {
  const dialogRef = useRef(null);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Native <dialog> gives us focus trapping, Esc to close and a backdrop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuantity(1);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!food) return null;

  const total = food.price * quantity;
  const ingredients = Array.isArray(food.ingredients) ? food.ingredients.join(", ") : null;

  const handleAdd = () => {
    addItem(food, quantity);
    onAdded?.();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby={`food-dialog-title-${food.id}`}
      className="m-auto w-[min(860px,92vw)] overflow-hidden rounded-3xl bg-white p-0 backdrop:bg-black/60"
    >
      <div className="relative grid gap-6 p-6 md:grid-cols-2">
        <img
          src={food.image}
          alt={food.name}
          className="h-64 w-full rounded-2xl object-cover md:h-full md:min-h-[360px]"
        />

        <div className="flex flex-col">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
          >
            ✕
          </button>

          <h2
            id={`food-dialog-title-${food.id}`}
            className="pr-12 text-3xl font-semibold text-red-500"
          >
            {food.name}
          </h2>

          <p className="mt-4 text-neutral-900">{food.description}</p>
          {ingredients && (
            <p className="mt-3 text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">Ingredients: </span>
              {ingredients}
            </p>
          )}

          <div className="mt-auto pt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-neutral-900">Total price</p>
                <p className="text-2xl font-semibold" aria-live="polite">
                  {formatPrice(total)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-lg disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-4 text-center font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-900 text-lg"
                >
                  +
                </button>
              </div>
            </div>

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