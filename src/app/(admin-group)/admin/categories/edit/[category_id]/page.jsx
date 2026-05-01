import { fetchCategory } from "@/api/api-call";
import EditCategory from "@/app/components/admin/EditCategory";

export default async function EditCategoryPage({ params }) {
    const promise = await params;

  const id = promise?.category_id;

  const { category, imageBaseUrl } =
    await fetchCategory({ id });

  if (!category.length) {
    return <div>Category Not Found</div>;
  }

  return (
    <EditCategory
      category={category[0]}
      imageBaseUrl={imageBaseUrl}
    />
  );
}
