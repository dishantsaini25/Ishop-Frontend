// import { cookies } from "next/headers";
import { axiosInstance } from "../../helper/helper";

export const fetchCategory = async (queryObject = {}) => {
  const query = new URLSearchParams();

  if (queryObject.id) query.append("id", queryObject.id);
  if (queryObject.status) query.append("status", queryObject.status);
  if (queryObject.is_top) query.append("is_top", queryObject.is_top);
  if (queryObject.limit) query.append("limit", queryObject.limit);
  if (queryObject.is_home) query.append("is_home", queryObject.is_home);

  try {
    const response = await axiosInstance.get(
      `category?${query.toString()}`
    );

    if (response.data.success) {
      return {
        category: response.data.data?.category || [],
        imageBaseUrl: response.data.data?.imageBaseUrl || "",
      };
    }
    return {
      category: [],
      imageBaseUrl: "",
    };

  } catch (error) {
    console.log("Fetch Category Error:", error);

    return {
      category: [],
      imageBaseUrl: "",
    };
  }
};




// export const fetchBrand = (queryObject = {}) => {

//   const query = new URLSearchParams();

//   if (queryObject.id)
//     query.append("id", queryObject.id);

//   if (queryObject.status !== undefined)
//     query.append("status", queryObject.status);

//   if (queryObject.category_slug)
//     query.append("category_slug", queryObject.category_slug);

//   const queryString = query.toString();

//   const url = queryString ? `brands?${queryString}` : `brands`;

//   return axiosInstance.get(url)
//     .then(res => {

//       if (res.data.success) {

//         return {
//           brand: res.data.data?.brand || [],
//           imageBaseUrl: res.data.data?.imageBaseUrl || ""
//         };

//       }

//       return null;

//     })
//     .catch((error) => {

//       console.log("Fetch Brand Error:", error.response?.data || error.message);
//       return null;

//     });
// };



export const fetchBrand = async (queryObject = {}) => {
  const query = new URLSearchParams();

  if (queryObject.id)
    query.append("id", queryObject.id);

  if (queryObject.status !== undefined)
    query.append("status", queryObject.status);

  if (queryObject.category_slug)
    query.append("category_slug", queryObject.category_slug);
    
  if (queryObject.limit)
    query.append("limit", queryObject.limit);

  const queryString = query.toString();
  const url = queryString ? `brands?${queryString}` : `brands`;

  // ✅ Check if running on server or client
  const isServer = typeof window === 'undefined';

  try {
    let data;
    
    if (isServer) {
      // ✅ Server-side: Use fetch with full URL
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      const fullUrl = `${cleanBaseUrl}/${url}`;
      
      console.log("Server fetching brands:", fullUrl);
      
      const response = await fetch(fullUrl, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });
      
      data = await response.json();
    } else {
      // ✅ Client-side: Use axiosInstance (existing)
      const response = await axiosInstance.get(url);
      data = response.data;
    }

    if (data.success) {
      return {
        brand: data.data?.brand || [],
        imageBaseUrl: data.data?.imageBaseUrl || ""
      };
    }
    
    return { brand: [] };
  } catch (error) {
    console.log("Fetch Brand Error:", error.response?.data || error.message);
    return { brand: [] };
  }
};



export const fetchColors = (queryObject = {}) => {
  const query = new URLSearchParams();
  if (queryObject.id)
    query.append("id", queryObject.id);
  if (queryObject.status) query.append("status", queryObject.status);


  return axiosInstance.get(`colors?${query.toString()}`)
    .then((response) => {
      if (response.data.success) {
        return {
          colors: response.data.data.colors
        };
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
};



// export const fetchProduct = async (queryObject = {}) => {
//   try {
//     const query = new URLSearchParams();

//     if (queryObject.id) query.append("id", queryObject.id);
//     if (queryObject.category_slug) query.append("category_slug", queryObject.category_slug);
//     if (queryObject.brand_slug) query.append("brand_slug", queryObject.brand_slug);
//     if (queryObject.color_slug) query.append("color_slug", queryObject.color_slug);


//     if (queryObject.min_price)
//       query.append("min_price", queryObject.min_price);

//     if (queryObject.max_price)
//       query.append("max_price", queryObject.max_price);

//     if (queryObject.status !== undefined) query.append("status", queryObject.status);
//      if (queryObject.page)
//       query.append("page", queryObject.page);

//     if (queryObject.sort)
//       query.append("sort", queryObject.sort);

//     const queryString = query.toString();
//     const url = queryString ? `products?${queryString}` : `products`;

//     const response = await axiosInstance.get(url);

//     if (response.data.success) {
//       return {
//         product: response.data.data?.product || [],
//         colors: response.data.data?.colors || [],
//         brands: response.data.data?.brands || [],
//         categories: response.data.data?.categories || [],
//         imageBaseUrl: response.data.data?.imageBaseUrl || "",
//         maxPrice: response.data.data?.maxPrice || 5000,
//          total: response.data.data?.total || 0,
//         currentPage: response.data.data?.currentPage || 1,
//         totalPages: response.data.data?.totalPages || 1,
//       };
//     }

//     return null;
//   } catch (error) {
//     console.log("Fetch Product Error:", error.response?.data || error.message);
//     return null;
//   }
// };



export const fetchProduct = async (queryObject = {}) => {
  try {
    const query = new URLSearchParams();

    // Existing filters
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
    
    // ✅ New filters for tabs
    if (queryObject.stock !== undefined) query.append("stock", queryObject.stock);
    if (queryObject.is_best_seller !== undefined) query.append("is_best_seller", queryObject.is_best_seller);
    if (queryObject.is_hot !== undefined) query.append("is_hot", queryObject.is_hot);
    if (queryObject.is_featured !== undefined) query.append("is_featured", queryObject.is_featured);
    if (queryObject.show_home !== undefined) query.append("show_home", queryObject.show_home);

    const queryString = query.toString();
    const url = queryString ? `products?${queryString}` : `products`;

    const response = await axiosInstance.get(url);

    if (response.data.success) {
      return {
        product: response.data.data?.product || [],
        colors: response.data.data?.colors || [],
        brands: response.data.data?.brands || [],
        categories: response.data.data?.categories || [],
        imageBaseUrl: response.data.data?.imageBaseUrl || "",
        maxPrice: response.data.data?.maxPrice || 5000,
        total: response.data.data?.total || 0,
        currentPage: response.data.data?.currentPage || 1,
        totalPages: response.data.data?.totalPages || 1,
      };
    }

    return null;
  } catch (error) {
    console.log("Fetch Product Error:", error.response?.data || error.message);
    return null;
  }
};




