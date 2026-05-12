import { fetchProduct } from "@/api/api-call";
import ProductClient from "./ProductClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productData = await fetchProduct({ slug, status: true });
  const product = productData?.product?.[0];

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const imageUrl = product.thumbnail
    ? (product.thumbnail.startsWith('http') ? product.thumbnail : `${productData?.imageBaseUrl}/main/${product.thumbnail}`)
    : null;

  return {
    title: `${product.name} - Buy Online`,
    description: product.description?.substring(0, 160) || `Buy ${product.name} at the best price.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at the best price.`,
      url: `/product/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at the best price.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const productData = await fetchProduct({ slug, status: true });
  const product = productData?.product?.[0] || null;
  const imageBaseUrl = productData?.imageBaseUrl || "";

  // Fetch related products (same category)
  let relatedProducts = [];
  if (product?.category_slug) {
    const relatedData = await fetchProduct({
      category_slug: product.category_slug,
      status: true,
      limit: 8,
    });
    relatedProducts = relatedData?.product || [];
  }

  // JSON-LD structured data for Google rich results
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: product.thumbnail ? (product.thumbnail.startsWith('http') ? product.thumbnail : `${imageBaseUrl}/main/${product.thumbnail}`) : "",
        sku: product._id,
        brand: {
          "@type": "Brand",
          name: product.brand_id?.name || "Generic",
        },
        offers: {
          "@type": "Offer",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/product/${slug}`,
          priceCurrency: "INR",
          price: product.final_price,
          availability: product.stock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Swoo Tech Mart" },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient
        product={product}
        imageBaseUrl={imageBaseUrl}
        relatedProducts={relatedProducts}
      />
    </>
  );
}