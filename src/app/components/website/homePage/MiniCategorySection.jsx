// components/MiniCategorySection.jsx
import MiniCategoryPanel from "./MiniCategoryPanel";

const commonItems = [
  { label: "Speaker", items: 12, image: "/image/Speaker.png" },
  { label: "Speaker", items: 12, image: "/image/Speaker.png" },
  { label: "Speaker", items: 12, image: "/image/Speaker.png" },
  { label: "Speaker", items: 12, image: "/image/Speaker.png" },
];

export default function MiniCategorySection() {
  return (
    <section className="w-full mt-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-1 lg:flex-row lg:px-10">
        <div className="w-full lg:w-1/3">
          <MiniCategoryPanel
            title="AUDIOS & CAMERAS"
            bannerImage="/image/Audio.png"
            items={commonItems}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <MiniCategoryPanel
            title="GAMING"
            bannerImage="/image/Gaming.png"
            items={commonItems}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <MiniCategoryPanel
            title="OFFICE EQUIPMENTS"
            bannerImage="/image/Office.png"
            items={commonItems}
          />
        </div>
      </div>
    </section>

    
  );
}
