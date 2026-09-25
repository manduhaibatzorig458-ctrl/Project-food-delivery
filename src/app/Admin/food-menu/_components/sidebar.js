"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Truck } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col px-4 py-6 bg-white">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-5 px-2">
        <Image
          src="/Logo.png"
          alt="NomNom Logo"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div>
          <p className="text-[20px] font-semibold text-neutral-900">NomNom</p>

          <p className="text-xs text-neutral-500">Swift delivery</p>
        </div>
      </div>

      {/* Food menu */}
      <Link
        href="/admin/food-menu"
        className="mb-1 flex items-center gap-2.5 rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-900 hover:text-white"
      >
        <LayoutDashboard className="h-4 w-4" />
        Food menu
      </Link>

      {/* Orders */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-2.5 rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-900 hover:text-white"
      >
        <Truck className="h-4 w-4" />
        Orders
      </Link>
    </aside>
  );
}
