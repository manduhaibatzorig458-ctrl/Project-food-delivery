export default function HeroBanner({
  eyebrow = "Steak society",
  title = "Today's",
  highlight = "Offer!",
}) {
  return (
    <section className="relative overflow-hidden bg-[#f3ede3] min-h-[220px]">
      <div
        className="absolute inset-0 flex items-center whitespace-nowrap font-serif font-bold text-[44px] text-black/[0.08] overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>Say cheese · Fresh fast delivered ·&nbsp;</span>
        ))}
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto px-6 sm:px-10 py-9 min-h-[220px] bg-[#0d0d0d] rounded-b-[32px] md:rounded-l-none md:rounded-r-full">
        <div className="flex flex-col gap-4 flex-shrink-0 items-center md:items-start text-center md:text-left">
          <h1 className="m-0 font-serif font-extrabold text-[40px] sm:text-[56px] md:text-[64px] leading-[0.95] text-white">
            {title}
          </h1>
          <span className="inline-block w-fit px-4.5 py-2 rounded-full bg-[#e8543d] text-white text-[13px] font-semibold uppercase tracking-wide">
            {eyebrow}
          </span>
        </div>

        <div className="relative flex items-end justify-center flex-1 min-w-0 order-3 md:order-none">
          <div
            className="grid place-items-center w-[220px] h-[220px] rounded-full text-[88px] shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            style={{ background: "radial-gradient(circle at 35% 30%, #d8cfc0, #b8ad98)" }}
            role="img"
            aria-label="Featured steak plate"
          >
            🥩
          </div>
          <div
            className="grid place-items-center w-[100px] h-[100px] rounded-full bg-white text-4xl absolute right-[8%] -top-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
            role="img"
            aria-label="Key lime pie"
          >
            🥧
          </div>
          <span className="absolute right-[22%] top-[22%] text-3xl text-[#e8543d] font-extrabold" aria-hidden="true">
            +
          </span>
        </div>

        <h2 className="m-0 font-serif font-extrabold text-[36px] sm:text-[48px] md:text-[56px] text-white flex-shrink-0">
          {highlight}
        </h2>
      </div>
    </section>
  );
}