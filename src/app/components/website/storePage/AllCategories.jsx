import { fetchCategory } from "@/api/api-call";
import CategoriesList from "./CategoriesList";

export default async function AllCategories() {

  const { category = [] } =
    await fetchCategory({ status: true });

  return <CategoriesList category={category} />;
}
