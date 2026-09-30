"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";

const fmt = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DateRangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const label =
    value.from && value.to
      ? `${fmt(value.from)} - ${fmt(value.to)}`
      : "Select date range";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm"
      >
        <Calendar className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg bg-white p-4 shadow-lg ring-1 ring-zinc-100">
          <label className="block text-xs text-zinc-500">From</label>
          <input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="mb-3 w-full rounded border px-2 py-1 text-sm"
          />
          <label className="block text-xs text-zinc-500">To</label>
          <input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="w-full rounded border px-2 py-1 text-sm"
          />
          <button
            onClick={() => onChange({ from: "", to: "" })}
            className="mt-3 text-xs text-zinc-500 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
