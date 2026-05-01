export default function StoreTopSection() {
    return (
        <section className="bg-white py-6">
            <div className="max-w-7xl mx-auto px-4">

                {/* Heading */}
                <h2 className="text-lg font-semibold mb-6 uppercase">
                    TOP CELL PHONES & TABLETS
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Left Banner */}
                    <div
                        className="md:col-span-2 relative rounded-xl overflow-hidden min-h-[320px] bg-cover bg-center flex items-center"
                        style={{ backgroundImage: "url('/image/storeTop.png')" }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>

                        <div className="relative z-10 text-white px-10 max-w-md">
                            <h3 className="text-3xl font-bold leading-tight">
                                Noise Cancelling
                                <br />
                                <span className="font-light">Headphone</span>
                            </h3>

                            <p className="mt-4 text-sm opacity-90">
                                Boso Over-Ear Headphone <br />
                                Wifi, Voice Assistant, <br />
                                Low Latency Game Mode
                            </p>

                            <button className="mt-6 bg-white text-black px-5 py-2 rounded-md text-sm font-medium hover:scale-105 transition">
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Right Banner */}
                    <div
  className="relative rounded-xl overflow-hidden min-h-[320px] bg-cover bg-center p-8"
  style={{ backgroundImage: "url('/image/storeTop2.png')" }}
>
  <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative z-10 flex justify-between items-start h-full">

    {/* Left Content */}
    <div>
      <h3 className="text-xl font-semibold text-black">
        redmi note 12 <br />
        Pro+ 5g
      </h3>

      <p className="mt-2 text-sm text-gray-700">
        Rise to the challenge
      </p>
    </div>

    {/* Right Button */}
    <button className="bg-black text-white px-4 py-2 rounded-md text-xs font-medium hover:scale-105 transition">
      SHOP NOW
    </button>

  </div>
</div>


                </div>
            </div>
        </section>
    );
}
