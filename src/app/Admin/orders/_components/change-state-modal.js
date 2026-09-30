"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { STATUSES } from "./status-select";

// Эцэг нь нээлттэй үед л mount хийнэ, тиймээс хаагаад нээх бүрд сонголт цэвэрлэгдэнэ
export default function ChangeStateModal({ saving, onClose, onSave }) {
  const [status, setStatus] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[400px] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Change delivery state</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-100 p-1.5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex gap-3">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                status === s.value
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-transparent bg-zinc-100 text-zinc-900"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSave(status)}
          disabled={!status || saving}
          className="mt-6 w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}