"use client";

import { useState } from "react";
import ProductOverlay from "./ProductOverlay";
import { IoEyeSharp } from "react-icons/io5";

const ViewButton = ({ product, imageBaseUrl }) => {

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
        onClick={() => setOpen(true)}
      >
        <IoEyeSharp size={18} />
      </button>

      <ProductOverlay
        imageBaseUrl={imageBaseUrl}
        product={product}
        isOpen={open}          
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ViewButton;
