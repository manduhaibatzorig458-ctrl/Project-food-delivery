"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function Footer({ categories = [] }) {
  return (
    <footer className={`${inter.className} bg-[#19191b] text-white`}>
      {/* Red moving text */}
      <div className="border-t-40 border-[#19191b] overflow-hidden bg-[#e0544f] py-5">
        <div className="footer-marquee flex w-max">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <p key={item} className="px-8 text-[28px] font-semibold">
              Fresh fast delivered
            </p>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-350 px-[6%]">
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
          {/* Logo */}
          <div>
            <img src="/Logo.png" alt="NomNom" className="h-10 w-10" />

            <p className="mt-2 font-bold">
              Nom
              <span className="text-[#e0544f]">Nom</span>
            </p>

            <p className="text-[11px]">Swift delivery</p>
          </div>

          {/* NomNom */}
          <div>
            <h3 className="mb-4 text-sm text-neutral-500">NOMNOM</h3>

            <p className="mb-4 text-sm">
              <Link href="/" className="text-white hover:text-[#e0544f]">
                Home
              </Link>
            </p>

            <p className="mb-4 text-sm">
              <Link href="#" className="text-white hover:text-[#e0544f]">
                Contact us
              </Link>
            </p>

            <p className="mb-4 text-sm">
              <Link href="#" className="text-white hover:text-[#e0544f]">
                Delivery zone
              </Link>
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="mb-4 text-sm text-neutral-500">MENU</h3>

            <div className="grid grid-cols-2 gap-5">
              {/* First column */}
              <div>
                {categories.slice(0, 4).map((category) => (
                  <p key={category.id} className="mb-4 text-sm">
                    <a
                      href={`#category-${category.id}`}
                      className="text-white hover:text-[#e0544f]"
                    >
                      {category.label}
                    </a>
                  </p>
                ))}
              </div>

              {/* Second column */}
              <div>
                {categories.slice(4).map((category) => (
                  <p key={category.id} className="mb-4 text-sm">
                    <a
                      href={`#category-${category.id}`}
                      className="text-white hover:text-[#e0544f]"
                    >
                      {category.label}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="mb-4 text-sm text-neutral-500">FOLLOW US</h3>

            <div className="flex">
              {/* Facebook */}
              <a href="#" aria-label="Facebook">
                <Button variant="ghost" size="icon">
                  <Image
                    src="/icons/Facebook.png"
                    alt="Facebook"
                    width={20}
                    height={20}
                  />
                </Button>
              </a>

              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <Button variant="ghost" size="icon">
                  <Image
                    src="/icons/Instagram.png"
                    alt="Instagram"
                    width={20}
                    height={20}
                  />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Line */}
        <div className="h-px bg-neutral-600" />

        {/* Bottom */}
        <div className="flex flex-wrap gap-8 py-8 text-xs text-neutral-500">
          <p>Copyright © 2026 Nomnom LLC</p>

          <Link href="#" className="hover:text-white">
            Privacy policy
          </Link>

          <Link href="#" className="hover:text-white">
            Terms and conditions
          </Link>

          <Link href="#" className="hover:text-white">
            Cookie policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
