// All fetches go directly to backend - works both server-side and client-side
// No axiosInstance needed here since these are public/read endpoints

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const apiFetch = async (path) => {
  const response = await fetch(`${backendUrl()}/${path}`, {
    cache: 'no-store',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

export const fetchCategory = async (queryObject = {}) => {
  const query = new URLSearchParams();
  if (queryObject.id) query.append("id", queryObject.id);
  if (queryObject.status) query.append("status", queryObject.status);
  if (queryObject.is_top) query.append("is_top", queryObject.is_top);
  if (queryObject.limit) query.append("limit", queryObject.limit);
  if (queryObject.is_home) query.append("is_home", queryObject.is_home);

  try {
    const data = await apiFetch(`category?${query.toString()}`);
    if (data.success) {
      return {
        category: data.data?.category || [],
        imageBaseUrl: data.data?.imageBaseUrl || "",
      };
    }
    return { category: [], imageBaseUrl: "" };
  } catch (error) {
    console.log("Fetch Category Error:", error.message);
    return { category: [], imageBaseUrl: "" };
  }
};

export const fetchBrand = async (queryObject = {}) => {
  const query = new URLSearchParams();
  if (queryObject.id) query.append("id", queryObject.id);
  if (queryObject.status !== undefined) query.append("status", queryObject.status);
  if (queryObject.category_slug) query.append("category_slug", queryObject.category_slug);
  if (queryObject.limit) query.append("limit", queryObject.limit);

  const queryString = query.toString();
  const path = queryString ? `brands?${queryString}` : `brands`;

  try {
    const data = await apiFetch(path);
    if (data.success) {
      return {
        brand: data.data?.brand || [],
        imageBaseUrl: data.data?.imageBaseUrl || "",
      };
    }
    return { brand: [], imageBaseUrl: "" };
  } catch (error) {
    console.log("Fetch Brand Error:", error.message);
    return { brand: [], imageBaseUrl: "" };
  }
};

export const fetchColors = async (queryObject = {}) => {
  const query = new URLSearchParams();
  if (queryObject.id) query.append("id", queryObject.id);
  if (queryObject.status) query.append("status", queryObject.status);

  try {
    const data = await apiFetch(`colors?${query.toString()}`);
    if (data.success) {
      return { colors: data.data.colors };
    }
    return { colors: [] };
  } catch (error) {
    console.log("Fetch Colors Error:", error.message);
    return { colors: [] };
  }
};

export const fetchProduct = async (queryObject = {}) => {
  try {
    const query = new URLSearchParams();
    if (queryObject.id) query.append("id", queryObject.id);
    if (queryObject.category_slug) query.append("category_slug", queryObject.category_slug);
    if (queryObject.brand_slug) query.append("brand_slug", queryObject.brand_slug);
    if (queryObject.color_slug) query.append("color_slug", queryObject.color_slug);
    if (queryObject.min_price) query.append("min_price", queryObject.min_price);
    if (queryObject.max_price) query.append("max_price", queryObject.max_price);
    if (queryObject.status !== undefined) query.append("status", queryObject.status);
    if (queryObject.page) query.append("page", queryObject.page);
    if (queryObject.sort) query.append("sort", queryObject.sort);
    if (queryObject.limit) query.append("limit", queryObject.limit);
    if (queryObject.slug) query.append("slug", queryObject.slug);
    if (queryObject.stock !== undefined) query.append("stock", queryObject.stock);
    if (queryObject.is_best_seller !== undefined) query.append("is_best_seller", queryObject.is_best_seller);
    if (queryObject.is_hot !== undefined) query.append("is_hot", queryObject.is_hot);
    if (queryObject.is_featured !== undefined) query.append("is_featured", queryObject.is_featured);
    if (queryObject.show_home !== undefined) query.append("show_home", queryObject.show_home);
    if (queryObject.search) query.append("search", queryObject.search);

    const queryString = query.toString();
    const path = queryString ? `products?${queryString}` : `products`;

    const data = await apiFetch(path);

    if (data.success) {
      return {
        product: data.data?.product || [],
        colors: data.data?.colors || [],
        brands: data.data?.brands || [],
        categories: data.data?.categories || [],
        imageBaseUrl: data.data?.imageBaseUrl || "",
        maxPrice: data.data?.maxPrice || 5000,
        total: data.data?.total || 0,
        currentPage: data.data?.currentPage || 1,
        totalPages: data.data?.totalPages || 1,
      };
    }
    return null;
  } catch (error) {
    console.log("Fetch Product Error:", error.message);
    return null;
  }
};
