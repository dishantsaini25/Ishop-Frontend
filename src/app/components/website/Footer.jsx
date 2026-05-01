import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-[#666] text-sm border-t border-gray-200">
      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-330 mx-auto px-4 py-14">
        {/* FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-y-10 gap-x-4">
          {/* INFO (WIDER COLUMN) */}
          <div className="lg:col-span-2">
            <h2 className="text-black font-bold text-[18px] mb-4 whitespace-nowrap">
              SWOO - 1ST NYC TECH ONLINE MARKET
            </h2>

            <p className="text-xs uppercase mb-1">Hotline 24/7</p>
            <p className="text-[22px] font-bold text-[#ff6a00] mb-4">
              (025) 3686 25 16
            </p>

            <p className="leading-6">
              257 Thatcher Road St, Brooklyn, Manhattan, NY 10092
              <br />
              contact@swootechmart.com
            </p>

            <div className="flex gap-2 mt-5">
              <Social>
                <FaTwitter />
              </Social>
              <Social>
                <FaFacebookF />
              </Social>
              <Social>
                <FaInstagram />
              </Social>
              <Social>
                <FaYoutube />
              </Social>
              <Social>
                <FaPinterestP />
              </Social>
            </div>
          </div>

          <Column
            title="Top Categories"
            items={[
              "Laptops",
              "PC & Computers",
              "Cell Phones",
              "Tablets",
              "Gaming & VR",
              "Networks",
              "Cameras",
              "Sounds",
              "Office",
            ]}
          />

          <Column
            title="Company"
            items={[
              "About Swoo",
              "Contact",
              "Career",
              "Blog",
              "Sitemap",
              "Store Locations",
            ]}
          />

          <Column
            title="Help Center"
            items={[
              "Customer Service",
              "Policy",
              "Terms & Conditions",
              "Track Order",
              "FAQs",
              "My Account",
              "Product Support",
            ]}
          />

          <Column
            title="Partner"
            items={[
              "Become Seller",
              "Affiliate",
              "Advertise",
              "Partnership",
            ]}
          />
        </div>

        {/* SUBSCRIBE SECTION */}
        <div className="mt-14 pt-10 relative">
          {/* CENTER CONTENT */}
          <div className="text-center max-w-150 mx-auto">
            <h3 className="text-black font-semibold text-[18px] mb-4">
              SUBSCRIBE & GET{" "}
              <span className="text-[#ff6a00]">10% OFF</span> FOR YOUR FIRST
              ORDER
            </h3>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border-b border-gray-300 py-3 pr-24 focus:outline-none focus:border-black"
              />
              <button className="absolute cursor-pointer right-0 top-3 text-[#ff6a00] font-semibold text-[14px]">
                SUBSCRIBE
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              By subscribing, you're accepted to our{" "}
              <span className="underline cursor-pointer">Policy</span>
            </p>
          </div>

          {/* LEFT SELECTS – mobile: centered below, md+: absolute left */}
          <div className="mt-6 flex justify-center gap-3 text-xs md:absolute md:left-0 md:top-10 md:mt-0">
            <select className="border rounded px-3 py-1 bg-white cursor-pointer">
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>

            <div className="relative">
              <div className="border rounded px-3 py-1 flex items-center gap-2 bg-white pointer-events-none">
                <img
                  src="/image/england.png"
                  alt="English"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>Eng</span>
              </div>

              <select className="absolute inset-0 opacity-0 cursor-pointer">
                <option>English</option>
                <option>Hindi</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 py-5 text-xs">
        <div className="max-w-330 mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © 2024{" "}
            <span className="font-bold text-black text-[14px]">Shawonet3</span>{" "}
            . All Rights Reserved
          </p>

          <div className="flex gap-4 font-medium">
            <span>
              <img src="/image/paypal.png" alt="" />
            </span>
            <span>
              <img src="/image/mastercard.png" alt="" />
            </span>
            <span>
              <img src="/image/visa.png" alt="" />
            </span>
            <span>
              <img src="/image/strip.png" alt="" />
            </span>
            <span>
              <img src="/image/klarna.png" alt="" />
            </span>
          </div>

          <a href="#" className="text-blue-500">
            Mobile Site
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- COMPONENTS ---------- */

const Column = ({ title, items }) => (
  <div>
    <h3 className="text-black font-semibold text-[18px] mb-4">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="hover:text-black cursor-pointer">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Social = ({ children }) => (
  <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] transition cursor-pointer">
    {children}
  </div>
);
