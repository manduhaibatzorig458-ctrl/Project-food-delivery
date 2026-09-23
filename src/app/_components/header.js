export default function Header() {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 sm:px-10 bg-[#0d0d0d] border-b border-white/[0.06]">
      <link href="/" className="flex items-center gap-2.5 no-underline">
        <span
          className="grid place-items-center w-[34px] h-[34px] rounded-full bg-[#e8543d] text-base"
          aria-hidden="true"
        >
          🍔
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-serif font-extrabold text-lg text-white">
            Nom<span className="text-[#e8543d]">Nom</span>
          </span>
          <span className="text-[11px] text-neutral-400">Swift delivery</span>
        </span>
      </link>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8543d] text-[#e8543d] text-sm bg-transparent cursor-pointer"
        >
          <span className="text-sm">📍</span>
          <span>
            Delivery address: <strong className="text-white font-semibold">Add location</strong>
          </span>
          <span className="text-neutral-400">›</span>
        </button>

        <button
          type="button"
          className="grid place-items-center w-[38px] h-[38px] rounded-full border-none bg-white/[0.08] text-white text-[15px] cursor-pointer"
          aria-label="Cart"
        >
          🛒
        </button>

        <button
          type="button"
          className="grid place-items-center w-[38px] h-[38px] rounded-full border-none bg-[#e8543d] text-white text-[15px] cursor-pointer"
          aria-label="Account"
        >
          👤
        </button>
      </div>
    </header>
  );
}