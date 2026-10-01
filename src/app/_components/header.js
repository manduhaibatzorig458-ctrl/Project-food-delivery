"use client";

import { MapPin, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/(provider)/cart-provider";
import UserMenu from "./user-menu";

export default function Header() {
  const { itemCount, address, openCart } = useCart();

  return (
    <header className="flex items-center justify-between bg-[#19191b] px-[6%] py-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/Logo.png"
          alt="NomNom logo"
          className="h-11 w-11 object-contain"
        />

        <div>
          <div className="text-xl font-bold text-white">
            Nom<span className="text-[#ec5b48]">Nom</span>
          </div>

          <div className="text-xs text-white">Swift delivery</div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Address */}
        <Button
          onClick={openCart}
          className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-normal text-[#ec5b48] hover:bg-white/90"
        >
          <MapPin className="h-5 w-5" />

          <span>Delivery address:</span>

          <span className="max-w-50 truncate text-neutral-600">
            {address.trim() || "Add Location"}
          </span>

          <ChevronRight className="h-5 w-5 text-neutral-600" />
        </Button>

        {/* Cart */}
        <Button
          size="icon"
          onClick={openCart}
          className="relative h-11 w-11 rounded-full bg-white hover:bg-white/90"
        >
          <ShoppingCart className="h-5 w-5 text-black" />

          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ec5b48] px-1 text-[11px] font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Button>

        {/* User */}
        <UserMenu />
      </div>
    </header>
  );
}
