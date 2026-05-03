const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ishop-frontend.vercel.app"
).replace(/\/$/, "");

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ishop-backend-3i7s.onrender.com"
).replace(/\/$/, "");

// Static pages always included
const staticPages = [
  { url: BASE_URL,                  lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE_URL}/store`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap() {
  let productPages = [];
  let categoryPages = [];

  // Fetch products — fail silently so build never breaks
  try {
    const res = await fetch(`${API_BASE}/products?status=true&limit=200`, {
      next: { revalidate: 3600 }, // revalidate every hour — NOT cache:"no-store"
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.product)) {
        productPages = data.data.product.map((p) => ({
          url: `${BASE_URL}/product/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Backend unreachable at build time — that's fine, static pages still ship
  }

  // Fetch categories — fail silently
  try {
    const res = await fetch(`${API_BASE}/category?status=true`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.category)) {
        categoryPages = data.data.category.map((c) => ({
          url: `${BASE_URL}/store/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    }
  } catch {
    // fail silently
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
