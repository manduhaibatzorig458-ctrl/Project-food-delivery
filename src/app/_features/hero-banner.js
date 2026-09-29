"use client";

import Image from "next/image";
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: ["700", "800"] });

const RED = "#ec5b48";

// Ар талын давтагдах бичвэр
const words = [
  { text: "SAY CHEESE", tone: "grey" },
  { text: "·", tone: "red" },
  { text: "FRESH FAST", tone: "red" },
  { text: "DELIVERED!", tone: "grey" },
  { text: "·", tone: "red" },
];
const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Sequence() {
  return (
    <div className="flex shrink-0 gap-[2cqw] pr-[2cqw]">
      {words.map((w, i) => (
        <span
          key={i}
          className={w.tone === "red" ? "text-[#f2c5bc]" : "text-[#dedad6]"}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}

export default function HeroBanner() {
  return (
    <div className="w-full overflow-hidden bg-[#f4f2ef]">
      <style>{`
        @keyframes hero-marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes hero-marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .hero-marquee-row { will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .hero-marquee-row { animation: none !important; } }
      `}</style>

      {/* cqw = энэ хэсгийн өргөний 1% → бүх зүйл харьцаагаа алдалгүй томорно */}
      <section className="relative mx-auto w-full max-w-[1920px] [container-type:inline-size]">
        <div className="relative h-[39.4cqw] overflow-hidden">
          {/* Ар талын хөдөлдөг бичвэр */}
          <div
            aria-hidden="true"
            className={`${bebas.className} pointer-events-none absolute bottom-[-16cqw] left-[-22cqw] right-[-22cqw] top-[-16cqw] select-none -rotate-6`}
          >
            {rows.map((row) => (
              <div
                key={row}
                className="hero-marquee-row flex w-max whitespace-nowrap text-[10cqw] leading-[0.8]"
                style={{
                  height: "8cqw",
                  animation: `${
                    row % 2 === 0 ? "hero-marquee-left" : "hero-marquee-right"
                  } ${44 + (row % 3) * 8}s linear infinite`,
                  animationDelay: `-${row * 9}s`,
                }}
              >
                <Sequence />
                <Sequence />
                <Sequence />
                <Sequence />
              </div>
            ))}
          </div>

          {/* Баннер */}
          <div className="absolute left-0 top-[8.5cqw] z-10 h-[22.4cqw] w-full">
            {/* Улаан сүүдэр */}
            <div
              className="absolute left-0 top-0 h-full w-[90.5cqw] translate-x-[1.3cqw] translate-y-[1.1cqw] rounded-r-[11.2cqw]"
              style={{ backgroundColor: RED }}
            />
            {/* Хар хэлбэр */}
            <div className="absolute left-0 top-0 h-full w-[90.5cqw] rounded-r-[11.2cqw] bg-[#19191b]" />

            {/* TODAY'S */}
            <h1
              className={`${bebas.className} absolute left-[4cqw] top-[3.6cqw] z-10 whitespace-nowrap text-[10.9cqw] font-normal leading-[0.85] text-white`}
            >
              TODAY’S
            </h1>

            {/* STEAK SOCIETY */}
            <div className="absolute left-[9.1cqw] top-[14.5cqw] z-40 h-[4.9cqw] w-[23.3cqw]">
              <div className="absolute left-[0.7cqw] top-[0.7cqw] h-full w-full rounded-full bg-white" />
              <div
                className="relative flex h-full w-full items-center justify-center rounded-full"
                style={{ backgroundColor: RED }}
              >
                <span
                  className={`${inter.className} whitespace-nowrap text-[2.6cqw] font-bold leading-none tracking-tight text-white`}
                >
                  STEAK SOCIETY
                </span>
              </div>
            </div>

            {/* Гол хоол (зураг доторх хоосон зайг тооцож томруулсан) */}
            <div className="pointer-events-none absolute left-[44.8cqw] top-[11.9cqw] z-20 w-[58cqw] -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/healthy-bruschetta.png"
                alt="Food"
                width={918}
                height={917}
                priority
                className="h-auto w-full object-contain drop-shadow-[0_15px_12px_rgba(0,0,0,0.35)]"
              />
            </div>

            {/* + (CSS-ээр зурсан) */}
            <div className="absolute left-[61.9cqw] top-[4.8cqw] z-30 h-[3.4cqw] w-[3.4cqw] -translate-x-1/2 -translate-y-1/2">
              <span
                className="absolute left-0 top-1/2 h-[0.9cqw] w-full -translate-y-1/2"
                style={{ backgroundColor: RED }}
              />
              <span
                className="absolute left-1/2 top-0 h-full w-[0.9cqw] -translate-x-1/2"
                style={{ backgroundColor: RED }}
              />
            </div>

            {/* Жижиг таваг */}
            <div className="pointer-events-none absolute left-[73cqw] top-[2.3cqw] z-20 w-[28cqw] -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/dish.png"
                alt="Dish"
                width={220}
                height={150}
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Бялуу */}
            <div className="pointer-events-none absolute left-[72cqw] top-[0.2cqw] z-30 w-[12.6cqw] -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/cake.png"
                alt="Cake"
                width={315}
                height={190}
                priority
                className="h-auto w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]"
              />
            </div>

            {/* OFFER! */}
            <h2
              className={`${bebas.className} absolute left-[61.7cqw] top-[10.2cqw] z-40 whitespace-nowrap text-[11.2cqw] font-normal leading-[0.85] text-white`}
            >
              OFFER!
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
