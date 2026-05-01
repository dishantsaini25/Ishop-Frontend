import { fetchProduct } from '@/api/api-call';
import AddMultipleImages from '@/app/components/admin/AddMultipleImages';
import React from 'react'

export default async function page({params}) {
  const promise =await params;
  const id = promise.product_id;
  const {product,imageBaseUrl } = await fetchProduct({id});


  return (
    <div>
      <AddMultipleImages id={id} images={product.other_images} imageBaseUrl={imageBaseUrl}/>
    </div>
  )
}
