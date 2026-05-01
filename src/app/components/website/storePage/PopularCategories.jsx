import { fetchCategory } from "@/api/api-call";

export default async function PopularCategories() {
  const { category = [], imageBaseUrl = "" } = await fetchCategory({
    limit: 10,
    status: true,
    is_top: true,
  });

  return (
    <div id="category" className="bg-white rounded-xl p-6 shadow-sm">

      {/* Heading */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold uppercase">
          Popular Categories
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

        {category.map((item) => (
          <div
            key={item._id}
            className="text-center hover:shadow-md transition rounded-xl p-4 cursor-pointer"
          >
            {/* Image */}
            <div className="flex justify-center mb-4">
              <img
                src={imageBaseUrl + item.image}
                alt={item.name}
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Name */}
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              {item.name}
            </h3>

            {/* Count */}
            <div className="flex justify-center">
              <span className="text-gray-500 text-sm">
                {item.totalProducts ?? item.count ?? 0} Items
              </span>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
