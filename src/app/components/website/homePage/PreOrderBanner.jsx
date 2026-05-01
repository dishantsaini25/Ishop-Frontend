// components/PreOrderBanner.jsx
import Image from "next/image";

export default function PreOrderBanner() {
  return (
    // hidden on mobile, only show from md+
    <section className="hidden w-full rounded-[28px] bg-[#01A49E] md:block">
      <div className="relative flex h-35 items-center overflow-hidden px-4 sm:px-8 lg:px-10">
        {/* LEFT: PRE ORDER block */}
        <div className="relative z-10 mr-4 text-white">
          <p className="text-[13px] font-semibold uppercase tracking-wide">
            PRE ORDER
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/80">
            BE THE FIRST TO OWN
          </p>
          <p className="mt-3 text-[12px] text-white/90">
            From <span className="font-semibold">$399</span>
          </p>
        </div>

        {/* CENTER: blue shape + watch */}
        <div className="relative z-10 flex h-full flex-1 items-center">
          <div className="pointer-events-none absolute left-1/5 -top-32.5 h-100 w-100 rounded-full bg-[#5F81A2]" />

          <div className="relative ms-30 flex items-center">
            <Image
              src="/image/pre-watch.png"
              alt="Smart watch pre order"
              width={260}
              height={140}
              className="h-35 w-auto object-contain"
            />
          </div>

          <div className="relative ms-20 flex flex-col justify-center text-white">
            <p className="text-[11px] tracking-wide text-white/80">
              Opple Watch Sport
            </p>
            <p className="text-[11px] tracking-wide text-white/80">
              Series 8
            </p>
            <p className="mt-2 text-[18px] font-semibold sm:text-[22px]">
              A healthy leap ahead
            </p>
          </div>
        </div>

        {/* RIGHT: button */}
        <div className="relative z-10 ml-4 flex items-center">
          <button className="rounded-full bg-white px-6 py-2 text-[13px] font-semibold text-[#111827] shadow-sm hover:bg-gray-100">
            Discover Now
          </button>
        </div>
      </div>
    </section>
  );
}
