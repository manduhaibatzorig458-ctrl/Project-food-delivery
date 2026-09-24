"use client";

import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f4f2ef] py-30">
      
      {/* Main banner */}
      <div className="relative mx-auto h-82.5 w-full max-w-362.5">
        {/* Red shadow / border */}
        <div className="absolute -bottom-5  left-0 h-10 w-[91%] rounded-bl-[60px] rounded-br-[1100px] bg-[#ff5145]" />

        {/* Black shape */}
        <div className="absolute inset-0 z-10 overflow-visible rounded-bl-[70px] rounded-br-[170px] rounded-tr-[170px] bg-[#19191b]">
          {/* TODAY'S */}
          <div className="absolute left-12.5 top-12 z-40">
            <h1 className="font-black text-[72px] leading-[0.9] tracking-[-3px] text-white">
              TODAY’S
            </h1>

            {/* Steak Society */}
            <div className="relative mt-9.5 ml-18.75">
              {/* White shadow */}
              <div className="absolute left-2 top-2 h-17.5 w-83.75 rounded-full bg-white" />

              <div className="relative flex h-17.5 w-81.25 items-center justify-center rounded-full bg-[#ff5145]">
                <span className="text-[29px] font-extrabold tracking-[-1px] text-white">
                  STEAK SOCIETY
                </span>
              </div>
            </div>
          </div>

          {/* Main food */}
          <div className="absolute left-[15%] top-8 -mt-40">
            <Image
              src="/healthy-bruschetta.png"
              alt="Food"
              width={918}
              height={917}
              priority
              className="object-contain drop-shadow-[0_15px_12px_rgba(0,0,0,0.35)]"
            />
          </div>

          {/* Plus */}
          <div className="absolute right-[29%] top-8 z-50 mr-21">
            <span className="font-bold text-[68px] leading-none text-[#ff5145]">
              +
            </span>
          </div>

          {/* Cake */}
          <div className="absolute right-[4%] -top-16.25 z-50 mr-50">
            <Image
              src="/cake.png"
              alt="Cake"
              width={315}
              height={190}
              priority
              className="h-47.5 w-78.75 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]"
            />
          </div>

          {/* Small dish */}
          <div className="absolute right-[7%] z-40 mr-50">
            <Image
              src="/dish.png"
              alt="Dish"
              width={220}
              height={150}
              className="h-37.5 w-55 object-contain"
            />
          </div>

          {/* OFFER */}
          <div className="absolute right-[8%] top-36.25 z-30 mr-30">
            <h2 className="font-black text-[78px] leading-none tracking-[-3px] text-white">
              OFFER!
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

// rounded-tr-[170px]






