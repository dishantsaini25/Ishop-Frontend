"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Countdown hook ──────────────────────────────────────────────
function useCountdown(endTime) {
  const calc = useCallback(() => {
    if (!endTime) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const diff = new Date(endTime) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, expired: false };
  }, [endTime]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  return time;
}

// ── Timer box ───────────────────────────────────────────────────
function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#F5F7FA] w-12 h-14 sm:w-14 sm:h-16">
      <span className="text-base sm:text-lg font-bold text-gray-900 leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function DealsOfTheDay() {
  const [deal, setDeal] = useState(null);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    fetch(`${base}/products/deal-of-day`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.deal) {
          setDeal(data.data.deal);
          setImageBaseUrl(data.data.imageBaseUrl || `${base}/images/product/`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const timer = useCountdown(deal?.deal_of_day?.deal_end_time);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <section className="w-full bg-white rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-[#01A49E]/20" />
        <div className="p-6 grid gap-4 lg:grid-cols-3">
          <div className="h-64 bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-8 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  // ── No active deal ──
  if (!deal) return null;

  const {
    name,
    slug,
    thumbnail,
    other_images = [],
    original_price,
    final_price,
    deal_of_day,
    description,
  } = deal;

  const dealPrice = deal_of_day?.deal_discount_percent > 0
    ? Math.round(final_price * (1 - deal_of_day.deal_discount_percent / 100))
    : final_price;

  const savings = original_price - dealPrice;
  const savingsPct = Math.round((savings / original_price) * 100);

  const soldCount = deal_of_day?.sold_count || 0;
  const totalStock = deal_of_day?.total_stock_for_deal || 1;
  const soldPct = Math.min(Math.round((soldCount / totalStock) * 100), 100);

  // All images: thumbnail + other_images
  const allImages = [
    imageBaseUrl + "main/" + thumbnail,
    ...other_images.slice(0, 4).map((img) => imageBaseUrl + "other/" + img),
  ];

  return (
    <section className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden">

      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#01A49E] px-4 sm:px-6 py-3 gap-2">
        <h2 className="text-sm font-bold tracking-widest text-white uppercase">
          🔥 Deals of the Day
        </h2>
        <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-white/80">
          {"EVERYDAY".split("").map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="grid gap-4 sm:gap-6 p-4 sm:p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_2.5fr_1.4fr]">

        {/* ── LEFT: image gallery ── */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2 shrink-0">
              {allImages.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 overflow-hidden transition ${activeImg === i ? "border-[#01A49E]" : "border-gray-200 hover:border-[#01A49E]/50"}`}>
                  <img src={src} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative flex-1 rounded-2xl bg-gray-50 flex items-center justify-center p-4 min-h-[200px] sm:min-h-[260px]">
            {savingsPct > 0 && (
              <div className="absolute left-3 top-3 rounded-full bg-[#00BFA5] px-3 py-1 text-xs font-bold text-white shadow">
                SAVE {savingsPct}%
              </div>
            )}
            <img
              src={allImages[activeImg]}
              alt={name}
              className="max-h-48 sm:max-h-64 w-auto object-contain transition-all duration-300"
            />
          </div>
        </div>

        {/* ── MIDDLE: product info ── */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Link href={`/product/${slug}`}>
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] hover:text-[#01A49E] transition line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#00BFA5]">
              ₹{dealPrice.toLocaleString("en-IN")}
            </span>
            {savings > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{original_price.toLocaleString("en-IN")}
              </span>
            )}
            {deal_of_day?.deal_discount_percent > 0 && (
              <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                +{deal_of_day.deal_discount_percent}% Deal Off
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">{description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E6FFF8] px-3 py-1 text-[11px] font-semibold text-[#00BFA5]">FREE SHIPPING</span>
            <span className="rounded-full bg-[#E6FFF8] px-3 py-1 text-[11px] font-semibold text-[#00BFA5]">LIMITED OFFER</span>
          </div>

          {/* Timer */}
          {!timer.expired ? (
            <div className="mt-1">
              <p className="text-[11px] font-semibold text-gray-600 uppercase mb-2">
                ⏰ Hurry up! Offer expires in:
              </p>
              <div className="flex items-center gap-2">
                <TimeBox value={timer.d} label="Days" />
                <span className="text-gray-400 font-bold text-lg">:</span>
                <TimeBox value={timer.h} label="Hrs" />
                <span className="text-gray-400 font-bold text-lg">:</span>
                <TimeBox value={timer.m} label="Min" />
                <span className="text-gray-400 font-bold text-lg">:</span>
                <TimeBox value={timer.s} label="Sec" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500 font-medium">⚠️ Deal has expired</p>
          )}

          {/* Progress bar */}
          {totalStock > 0 && (
            <div className="mt-2">
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#00BFA5] transition-all duration-500"
                  style={{ width: `${soldPct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500">
                Sold: <span className="font-semibold text-gray-800">{soldCount}/{totalStock}</span>
                <span className="ml-2 text-[#00BFA5] font-medium">({100 - soldPct}% left)</span>
              </p>
            </div>
          )}

          {/* CTA */}
          <Link href={`/product/${slug}`}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-[#01A49E] hover:bg-[#019089] text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm w-full sm:w-auto">
            Shop Now →
          </Link>
        </div>

        {/* ── RIGHT: other images as banners ── */}
        <div className="hidden lg:flex flex-col gap-3">
          {other_images.slice(0, 3).map((img, i) => (
            <div key={i} className="relative h-28 w-full overflow-hidden rounded-2xl bg-[#F3F4F6] cursor-pointer"
              onClick={() => setActiveImg(i + 1)}>
              <img
                src={imageBaseUrl + "other/" + img}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {/* Fallback if no other images */}
          {other_images.length === 0 && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                  <span className="text-teal-300 text-3xl">🛍️</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
