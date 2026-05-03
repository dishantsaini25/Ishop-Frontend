import { getUser } from "@/api/api-server";
import ProductsWrapper from "@/app/components/website/storePage/ProductsWrapper";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Store - Shop All Electronics & Gadgets",
  description:
    "Browse our full collection of electronics, mobiles, laptops, tablets, and accessories. Filter by category, brand, and price.",
  openGraph: {
    title: "Store - Shop All Electronics & Gadgets",
    description: "Browse our full collection of electronics, mobiles, laptops, tablets, and accessories.",
    url: "/store",
  },
};


export default async function Page({ searchParams }) {

  const user = await getUser(); 

  return (
    <ProductsWrapper user={user} searchParams={searchParams} />
  );
}
