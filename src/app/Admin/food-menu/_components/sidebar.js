"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin/food-menu",
    label: "Food menu",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: Truck,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-[#F5F5F4] px-4 py-6">
      
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <Image
          src="/Logo.png"
          alt="NomNom Logo"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div>
          <p className="text-[15px] font-semibold text-neutral-900">
            NomNom
          </p>
          <p className="text-xs text-neutral-500">
            Swift delivery
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-200/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}