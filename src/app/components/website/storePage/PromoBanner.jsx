export default function PromoBanner() {
  return (
    <div className="hidden lg:block relative rounded-2xl overflow-hidden">

      <img
        src="/image/storebottom.png"
        alt="Promo Banner"
        className="w-full h-80 object-cover"
      />

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="absolute top-6 left-6 text-white z-10">
        <h2 className="text-2xl font-semibold leading-tight">
          OKODo hero 11+ <br /> 5K wireless
        </h2>

        <p className="text-gray-300 mt-4 uppercase text-sm">
          From
        </p>

        <p className="text-4xl font-bold text-green-400">
          $169
        </p>
      </div>
    </div>
  );
}
