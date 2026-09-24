import React from "react";
import { MapPin, ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-neutral-900 px-8 py-3.5">
      <div className="flex items-center gap-2.5">
        <img src="/Logo.png" alt="NomNom logo" className="h-8 w-8 object-contain" />
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-white">
            Nom<span className="text-orange-500">Nom</span>
          </span>
          <span className="text-[11px] text-neutral-400">Swift delivery</span>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <Button
          variant="secondary"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] text-red-500 hover:bg-white/90"
        >
          <MapPin className="h-4 w-4" />
          Delivery address:
          <span className="font-semibold text-neutral-900">Add Location</span>
          <ChevronRight className="h-4 w-4 text-neutral-900" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          aria-label="Cart"
          className="h-9 w-9 rounded-full bg-white hover:bg-white/90"
        >
          <ShoppingCart className="h-4 w-4 text-neutral-900" />
        </Button>

        <Button
          size="icon"
          aria-label="Profile"
          className="h-9 w-9 rounded-full bg-red-500 hover:bg-red-500/90"
        >
          <User className="h-4 w-4 text-white" />
        </Button>
      </div>
    </header>
  );
}