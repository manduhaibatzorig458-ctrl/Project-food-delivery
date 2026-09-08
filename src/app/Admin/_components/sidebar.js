"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dishes", label: "Food menu", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="text-xl">🥟</span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-900">NomNom</p>
          <p className="text-xs text-gray-400">Swift delivery</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100",
              ].join(" ")}
            >
              <Icon size={16} strokeWidth={2} className={active ? "text-white" : "text-gray-400"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}