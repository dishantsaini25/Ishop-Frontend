const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/store`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const res = await fetch(`${apiBase}/products?status=true&limit=200`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.data?.product) {
      productPages = data.data.product.map((product) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.log("Sitemap product fetch error:", err.message);
  }

  // Dynamic category pages
  let categoryPages = [];
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const res = await fetch(`${apiBase}/category?status=true`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.data?.category) {
      categoryPages = data.data.category.map((cat) => ({
        url: `${BASE_URL}/store/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.log("Sitemap category fetch error:", err.message);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
