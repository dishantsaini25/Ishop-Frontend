import ProductCard from "./ProductCard";

export default function ProductsGrid({ products, imageBaseUrl,user }) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((item) => (
        <ProductCard
          key={item._id}
          product={item}
          imageBaseUrl={imageBaseUrl}
          user={user}
        />
      ))}
    </div>
  );
}
