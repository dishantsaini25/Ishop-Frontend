// components/DealsOfTheDay.jsx
import Image from "next/image";

const thumbs = [
  { id: 1, src: "/image/Deal_2.png" },
  { id: 2, src: "/image/Deal_3.png" },
  { id: 3, src: "/image/Deal_4.png" },
  { id: 4, src: "/image/Deal_5.png" },
];

const rightBanners = [
  { id: 1, src: "/image/Deal_6.png" },
  { id: 2, src: "/image/Deal_7.png" },
  { id: 3, src: "/image/Deal_8.png" },
];

export default function DealsOfTheDay() {
  return (
    <section className="w-full bg-white rounded-3xl border border-[#E5E5E5] shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#01A49E] px-6 py-3 rounded-t-3xl text-white">
        <h2 className="text-sm font-semibold tracking-wide">
          DEALS OF THE DAY
        </h2>
        <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
          <span>E</span>
          <span>V</span>
          <span>E</span>
          <span>R</span>
          <span>Y</span>
          <span>D</span>
          <span>A</span>
          <span>Y</span>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4 px-6 py-6 lg:grid-cols-[1.6fr_2.4fr_1.4fr]">
        {/* LEFT: thumbnails + main image + badge */}
        <div className="flex gap-6">
          {/* Thumbs column */}
          <div className="flex flex-col items-center gap-10">
            {thumbs.map((t) => (
              <button
                key={t.id}
                className="flex h-16 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:border-[#01A49E]"
              >
                <Image
                  src={t.src}
                  alt="thumb"
                  width={40}
                  height={64}
                  className="h-14 w-auto object-contain"
                />
              </button>
            ))}

            {/* divider line */}
            {/* <div className="mt-1 h-12 w-[1px] bg-gray-300" /> */}
          </div>

          {/* Main product image + Save badge */}
          <div className="relative flex-1 rounded-3xl  flex items-center justify-center px-4 py-6">
            {/* Save badge */}
            <div className="absolute left-4 top-4 rounded-full bg-[#00BFA5] px-4 py-2 text-xs font-semibold text-white shadow-md">
              SAVE $199.00
            </div>

            <Image
              src="/image/Deal_mobile.png"
              alt="Deal product"
              width={220}
              height={260}
              className="h-65 w-auto object-contain"
            />
          </div>
        </div>

        {/* MIDDLE: product info */}
        <div className="flex flex-col gap-4">


          <h3 className="text-[16px] font-semibold text-[#111827] sm:text-[18px]">
            Xioma Redmi Note 11 Pro 256GB 2023, Black Smartphone
          </h3>

          {/* price row */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[22px] font-semibold text-[#00BFA5]">
              $569.00
            </span>
            <span className="text-[14px] text-gray-400 line-through">
              $759.00
            </span>
          </div>

          {/* features list */}
          <ul className="list-disc space-y-1 text-[13px] text-gray-600 pl-5">
            <li>
              Intel LGA 1700 Socket: Supports 13th &amp; 12th Gen Intel Core
            </li>
            <li>DDRS Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
            <li>
              Commanding Power Design: Twin 16+1+2 Phases Digital VRM
            </li>
          </ul>

          {/* badges row */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E6FFF8] px-4 py-1 text-[11px] font-semibold text-[#00BFA5]">
              FREE SHIPPING
            </span>
            <span className="rounded-full bg-[#E6FFF8] px-4 py-1 text-[11px] font-semibold text-[#00bfA5]">
              FREE GIFT
            </span>
          </div>

          {/* Hurry up + timer */}
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="max-w-35 text-[11px] font-semibold text-gray-700">
              HURRY UP! <br />
              PROMOTION WILL EXPIRES IN
            </div>

            <div className="flex items-center gap-2">
              {["d", "h", "m", "s"].map((unit, i) => (
                <div
                  key={unit}
                  className="flex h-16 w-12.5 flex-col items-center justify-center rounded-lg bg-[#F5F7FA]"
                >
                  <span className="text-[16px] font-semibold text-gray-900">
                    -16
                  </span>
                  <span className="text-[11px] uppercase text-gray-500">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar + sold info */}
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div className="h-1.5 w-1/3 rounded-full bg-[#00BFA5]" />
            </div>
            <p className="mt-2 text-[11px] text-gray-600">
              Sold: <span className="font-semibold text-gray-900">26/75</span>
            </p>
          </div>
        </div>

        {/* RIGHT: side banners */}
        <div className="flex flex-col gap-4">
          {rightBanners.map((b) => (
            <div
              key={b.id}
              className="relative h-35 w-full overflow-hidden rounded-3xl bg-[#F3F4F6]"
            >
              <Image
                src={b.src}
                alt={`deal banner ${b.id}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
