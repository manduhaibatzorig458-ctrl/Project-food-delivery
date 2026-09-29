import React from "react";
import { MapPin, ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-[#19191b] px-[6%] py-4">
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

      <div className="flex items-center gap-4">
        <Button className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-normal text-[#ec5b48] hover:bg-white/90">
          <MapPin className="h-5 w-5" />

          <span>Delivery address:</span>
          <span className="text-neutral-600">Add Location</span>

          <ChevronRight className="h-5 w-5 text-neutral-600" />
        </Button>

        <Button
          size="icon"
          className="h-11 w-11 rounded-full bg-white hover:bg-white/90"
        >
          <ShoppingCart className="h-5 w-5 text-black" />
        </Button>

        <Button
          size="icon"
          className="h-11 w-11 rounded-full bg-[#ec5b48] hover:bg-[#ec5b48]/90"
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  );
}
