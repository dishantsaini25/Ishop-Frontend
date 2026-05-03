import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/website/Header";
import Footer from "../components/website/Footer";
import StoreProvider from "@/redux/StoreProvider";
import { getUser } from "@/api/api-server";

export const dynamic = 'force-dynamic';


const geistSans = Geist({
  variable: "--font-geist-sans", subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Swoo Tech Mart - Best Electronics & Gadgets Online",
    template: "%s | Swoo Tech Mart",
  },
  description:
    "Shop the latest electronics, mobiles, laptops, tablets and gadgets at the best prices. Free shipping, easy returns, and 100% secure payments.",
  keywords: ["electronics", "mobiles", "laptops", "gadgets", "online shopping", "India"],
  authors: [{ name: "Swoo Tech Mart" }],
  creator: "Swoo Tech Mart",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Swoo Tech Mart",
    title: "Swoo Tech Mart - Best Electronics & Gadgets Online",
    description:
      "Shop the latest electronics, mobiles, laptops, tablets and gadgets at the best prices.",
    images: [{ url: "/image/Featured_Logo.png", width: 1200, height: 630, alt: "Swoo Tech Mart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swoo Tech Mart - Best Electronics & Gadgets Online",
    description: "Shop the latest electronics, mobiles, laptops, tablets and gadgets at the best prices.",
    images: ["/image/Featured_Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }) {
    const user = await getUser()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <StoreProvider>
          <Header user={user}  />
          {children}
          <Footer />
        </StoreProvider>

      </body>
    </html>
  );
}
