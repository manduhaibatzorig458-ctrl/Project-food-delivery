"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, Truck } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/food-menu", label: "Food menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#F5F5F4] px-4 py-6">
      <div className="mb-10 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8503A]">
          <Truck className="h-4 w-4 text-white" strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-neutral-900">NomNom</p>
          <p className="text-xs text-neutral-500">Swift delivery</p>
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
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-200/70",
              ].join(" ")}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}