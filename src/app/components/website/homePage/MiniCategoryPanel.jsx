// components/MiniCategoryPanel.jsx
import Image from "next/image";

export default function MiniCategoryPanel({ title, bannerImage, items }) {
  return (
    <section className="w-full rounded-3xl bg-white border border-[#E5E5E5] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#111827]">
          {title}
        </h3>
        <button className="text-[11px] font-medium text-gray-500 hover:text-[#01A49E]">
          View All
        </button>
      </div>

      {/* Banner with text overlay */}
      <div className="px-5 pt-3">
        <div className="relative h-37.5 overflow-hidden rounded-2xl bg-[#111827]">
          <Image
            src={bannerImage}
            alt={title}
            fill
            className="object-cover"
          />

          <div className="relative z-10 flex h-full flex-col justify-center px-5 text-white">
            <p className="text-[11px] font-semibold text-white/80">
              {title === "AUDIOS & CAMERAS" && "Best Speaker"}
              {title === "GAMING" && "Wireless RGB Gaming"}
              {title === "OFFICE EQUIPMENTS" && "Home Theater 4K"}
            </p>

            <p className="mt-1 text-[16px] font-semibold">
              {title === "AUDIOS & CAMERAS" && "2023"}
              {title === "GAMING" && "Mouse"}
              {title === "OFFICE EQUIPMENTS" && "Laser Projector"}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-5 border-t border-gray-100 px-5 pt-5 pb-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id ?? `${item.label}-${index}`}
              className="flex flex-col items-center gap-2 text-center text-[12px]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F4F6]">
                <Image
                  src={item.image}
                  alt={item.label}
                  width={60}
                  height={60}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-[#111827]">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-500">
                  {item.items} Items
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
