"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import StatusSelect from "../_components/status-select";
import ChangeStateModal from "../_components/change-state-modal";
import DateRangeFilter from "../_components/date-range-filter";
import Pagination from "../_components/pagination";

const API = "http://localhost:1000";
const PAGE_SIZE = 12;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const patchStatus = async (id, status) => {
  const res = await fetch(`${API}/admin/orders/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.status;
};

const formatDate = (value) => {
  const d = new Date(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}/${mm}/${dd}`;
};

const FoodCell = ({ items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative w-40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm"
      >
        {items.length} foods
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg bg-white p-3 shadow-lg ring-1 ring-zinc-100">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-1.5 text-xs">
              <img
                src={item.food?.image}
                alt=""
                className="h-9 w-9 rounded object-cover"
              />
              <span className="flex-1">
                {item.food?.foodName ?? item.food?.name ?? "Устгагдсан хоол"}
              </span>
              <span>x {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const OrderRow = memo(function OrderRow({
  order,
  number,
  selected,
  saving,
  onToggle,
  onStatusChange,
}) {
  return (
    <tr className={`border-b text-sm ${selected ? "bg-zinc-50" : ""}`}>
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(order._id)}
          className="h-4 w-4 accent-black"
        />
      </td>
      <td className="px-4 py-4">{number}</td>
      <td className="px-4 py-4">{order.user?.email ?? "-"}</td>
      <td className="px-4 py-4">
        <FoodCell items={order.foodOrderItems} />
      </td>
      <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
      <td className="px-4 py-4">${order.totalPrice.toFixed(2)}</td>
      <td className="px-4 py-4">
        <p className="line-clamp-2 max-w-[240px] text-xs text-zinc-500">
          {order.user?.address || "-"}
        </p>
      </td>
      <td className="px-4 py-4">
        <StatusSelect
          value={order.status}
          disabled={saving}
          onChange={(status) => onStatusChange(order._id, status)}
        />
      </td>
    </tr>
  );
});

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(new Set());
  const [savingId, setSavingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/admin/orders`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = useMemo(() => {
    const from = dateRange.from ? new Date(`${dateRange.from}T00:00:00`) : null;
    const to = dateRange.to ? new Date(`${dateRange.to}T23:59:59.999`) : null;

    const filtered = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return (!from || created >= from) && (!to || created <= to);
    });

    if (!sort.key) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) =>
      sort.key === "date"
        ? (new Date(a.createdAt) - new Date(b.createdAt)) * dir
        : a.status.localeCompare(b.status) * dir
    );
  }, [orders, dateRange, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const allSelected =
    pageRows.length > 0 && pageRows.every((o) => selected.has(o._id));

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
    setPage(1);
  };

  const handleToggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      pageRows.forEach((o) => (allSelected ? next.delete(o._id) : next.add(o._id)));
      return next;
    });
  };

  // Нэг мөрийн status солих: зөвхөн тэр мөр дахин render болно
  const handleStatusChange = useCallback(async (id, status) => {
    setSavingId(id);
    try {
      const saved = await patchStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: saved } : o))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }, []);

  // Сонгосон бүх захиалгын status-ийг нэг дор солих
  const handleBulkSave = async (status) => {
    const ids = [...selected];
    setBulkSaving(true);

    const results = await Promise.allSettled(ids.map((id) => patchStatus(id, status)));
    const okIds = new Set(ids.filter((_, i) => results[i].status === "fulfilled"));

    setOrders((prev) =>
      prev.map((o) => (okIds.has(o._id) ? { ...o, status } : o))
    );

    const failed = results.find((r) => r.status === "rejected");
    if (failed) setError(failed.reason.message);

    setSelected(new Set());
    setModalOpen(false);
    setBulkSaving(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const sortHead = (label, key) => (
    <button onClick={() => toggleSort(key)} className="flex items-center gap-2">
      {label}
      <ChevronsUpDown className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <div className="p-6">
      <div className="rounded-xl bg-white">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="text-xl font-bold">Orders</h1>
            <p className="text-xs text-zinc-500">{sorted.length} items</p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangeFilter
              value={dateRange}
              onChange={(v) => {
                setDateRange(v);
                setPage(1);
              }}
            />
            <button
              disabled={selected.size === 0}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              Change delivery state
              {selected.size > 0 && (
                <span className="rounded-full bg-white px-1.5 text-xs text-zinc-900">
                  {selected.size}
                </span>
              )}
            </button>
          </div>
        </div>

        {error && <p className="px-5 pb-3 text-sm text-red-500">{error}</p>}

        <table className="w-full text-left">
          <thead className="bg-zinc-100 text-sm text-zinc-500">
            <tr>
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="h-4 w-4 accent-black"
                />
              </th>
              <th className="px-4 py-4 font-normal">№</th>
              <th className="px-4 py-4 font-normal">Customer</th>
              <th className="px-4 py-4 font-normal">Food</th>
              <th className="px-4 py-4 font-normal">{sortHead("Date", "date")}</th>
              <th className="px-4 py-4 font-normal">Total</th>
              <th className="px-4 py-4 font-normal">Delivery Address</th>
              <th className="px-4 py-4 font-normal">
                {sortHead("Delivery state", "status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                  Захиалга олдсонгүй
                </td>
              </tr>
            )}
            {pageRows.map((order, i) => (
              <OrderRow
                key={order._id}
                order={order}
                number={startIndex + i + 1}
                selected={selected.has(order._id)}
                saving={savingId === order._id}
                onToggle={handleToggle}
                onStatusChange={handleStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

      {modalOpen && (
        <ChangeStateModal
          saving={bulkSaving}
          onClose={() => setModalOpen(false)}
          onSave={handleBulkSave}
        />
      )}
    </div>
  );
}