"use client";

import { ChevronsUpDown } from "lucide-react";

export const STATUSES = [
  { value: "PENDING", label: "Pending", border: "border-red-500" },
  { value: "DELIVERED", label: "Delivered", border: "border-green-500" },
  { value: "CANCELED", label: "Cancelled", border: "border-zinc-300" },
];

export default function StatusSelect({ value, onChange, disabled }) {
  const current = STATUSES.find((s) => s.value === value) ?? STATUSES[0];

  return (
    <div className="relative inline-block">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full border bg-white py-1 pl-3 pr-8 text-xs font-medium text-zinc-900 disabled:opacity-50 ${current.border}`}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
    </div>
  );
}