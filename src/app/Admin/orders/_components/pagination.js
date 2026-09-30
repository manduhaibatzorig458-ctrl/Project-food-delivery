"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const arrow = "flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-30";

  return (
    <div className="mt-6 flex justify-end gap-2">
      <button className={arrow} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPages(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={i} className="flex h-9 w-9 items-center justify-center text-sm">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(p)}
            className={`h-9 w-9 rounded-full text-sm ${
              p === page ? "bg-zinc-700 text-white" : "bg-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        className={arrow}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}