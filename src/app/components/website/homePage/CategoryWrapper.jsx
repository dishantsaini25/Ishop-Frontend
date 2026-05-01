"use client";
import { useEffect, useState } from "react";
import { fetchCategory } from "@/api/client-api-call";
import CategorySidebar from "./CategorySidebar";

export default function CategoryWrapper({ title = "Category" }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const { category = [], imageBaseUrl = "" } = await fetchCategory({
        limit: 10,
        status: true,
        is_home: true,
      });
      setCategories(category);
      setImageBaseUrl(imageBaseUrl);
    };
    loadCategories();
  }, []);

  return (
    <CategorySidebar
      title={title}
      categories={categories}
      imageBaseUrl={imageBaseUrl}
      open={open}
      onToggle={() => setOpen(!open)}
    />
  );
}