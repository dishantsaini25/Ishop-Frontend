import { getUser } from "@/api/api-server";
import ProductsWrapper from "@/app/components/website/storePage/ProductsWrapper";


export const dynamic = 'force-dynamic';


export default async function Page({ searchParams }) {

  const user = await getUser(); 

  return (
    <ProductsWrapper user={user} searchParams={searchParams} />
  );
}
