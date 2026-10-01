"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import FoodDetailDialog from "@/app/_features/food-detail-dialog";
import { useCart } from "@/app/(provider)/cart-provider";

export default function FoodCard({ dish, onAdd, onRemove }) {
  const { items, addItem, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const timer = useRef(null);

  // Backend `_id` ogdog tul id-g ni zaaval avna. price string irsen ch too bolgono.
  const food = { ...dish, id: dish.id ?? dish._id, price: Number(dish.price || 0) };

  // "added" ni sagsnaas garna: refresh hiisen ch, dialog-oos nemsen ch zuv haragdana.
  const added = items.some((i) => i.id === food.id);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  function showToast() {
    setToast(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(false), 2000);
  }

  function handleClick(e) {
    e.stopPropagation(); // + tovch dialog neegehgui
    if (added) {
      removeItem(food.id);
      onRemove?.(dish);
      return;
    }
    addItem(food, 1);
    onAdd?.(dish);
    showToast();
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return; // + tovch deerh Enter-iig davhar bitgii duudah
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-full w-full cursor-pointer flex-col rounded-[14px] bg-white p-2.5 text-[#111]"
      >
        {/* Food image */}
        <div className="relative m-2 aspect-[231/120] overflow-hidden rounded-[10px] bg-neutral-200">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">
              {dish.emoji || "🍽️"}
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            aria-label={added ? `Remove ${dish.name}` : `Add ${dish.name}`}
            aria-pressed={added}
            onClick={handleClick}
            className={`absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-base leading-none transition-colors ${
              added
                ? "bg-[#19191b] text-white"
                : "bg-white text-red-500 hover:bg-neutral-100"
            }`}
          >
            {added ? <Check className="size-3.5" strokeWidth={2.5} /> : "+"}
          </button>
        </div>

        {/* Name and price */}
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

      {/* Dialog-iig darj bolohoor div-iin gadna (sibling) baina: ugui bol backdrop дарахад хаагдаад дахин нээгдэнэ */}
      <FoodDetailDialog
        food={food}
        open={open}
        onClose={() => setOpen(false)}
        onAdded={showToast}
      />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-neutral-700 bg-[#19191b] px-4 py-2 text-xs text-white shadow-lg"
          style={{ animation: "food-toast-in 0.2s ease-out" }}
        >
          <style>{`
            @keyframes food-toast-in {
              from { opacity: 0; transform: translate(-50%, -8px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
          <Check className="size-3.5" />
          Food is being added to the cart!
        </div>
      )}
    </>
  );
}