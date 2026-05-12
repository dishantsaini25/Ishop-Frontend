import { fetchCategory } from "@/api/api-call";
import CategoriesList from "./CategoriesList";

export default async function AllCategories() {
  const { category = [] } = await fetchCategory({ status: true }) || {};
  // Only show categories that have at least 1 product
  const filtered = category.filter(c => (c.totalProducts || 0) > 0);
  return <CategoriesList category={filtered} />;
}
