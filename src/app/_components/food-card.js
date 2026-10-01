"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import FoodDetailDialog from "@/app/_features/food-detail-dialog";
import { useCart } from "@/app/(provider)/cart-provider";

export default function FoodCard({ dish, onAdd, onRemove }) {
  const { items, addItem, removeItem } = useCart();

  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  // Food-ийн id болон price-г бэлдэнэ
  const food = {
    ...dish,
    id: dish.id || dish._id,
    price: Number(dish.price || 0),
  };

  // Энэ food cart-д байгаа эсэх
  const added = items.some((item) => item.id === food.id);

  // + button дарах
  function handleAdd() {
    if (added) {
      removeItem(food.id);
      onRemove?.(dish);
      return;
    }

    addItem(food, 1);
    onAdd?.(dish);

    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2000);
  }

  return (
    <>
      {/* Food Card */}
      <div
        onClick={() => setOpen(true)}
        className="flex h-full w-full cursor-pointer flex-col rounded-[14px] bg-white p-2.5 text-[#111]"
      >
        {/* Image */}
        <div className="relative m-2 aspect-[231/120] overflow-hidden rounded-[10px] bg-neutral-200">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">
              {dish.emoji || "🍽️"}
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className={`absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full ${
              added
                ? "bg-[#19191b] text-white"
                : "bg-white text-red-500 hover:bg-neutral-100"
            }`}
          >
            {added ? <Check className="size-3.5" /> : "+"}
          </button>
        </div>

        {/* Name + Price */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-medium text-[#e0483d]">
            {dish.name}
          </h3>

          <span className="shrink-0 text-[13px] font-bold">
            ${food.price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        <p className="mb-0.5 mt-2 line-clamp-2 min-h-[2.7em] text-[10px] leading-[1.35] text-[#111]">
          {dish.description}
        </p>
      </div>

      {/* Food Detail Dialog */}
      <FoodDetailDialog
        food={food}
        open={open}
        onClose={() => setOpen(false)}
        onAdded={() => setToast(true)}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-md bg-[#19191b] px-4 py-2 text-xs text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="size-3.5" />
            Food is being added to the cart!
          </div>
        </div>
      )}
    </>
  );
}
