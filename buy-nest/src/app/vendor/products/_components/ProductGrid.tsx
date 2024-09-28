"use client";
import React from "react";
import { Pagination } from "antd";
import sampleImage from "../../../../../public/images/x-50486.jpg";
import { StaticImageData } from "next/image";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: StaticImageData;
  summary: string;
  sales: number;
  remaining: number;
}

const sampleProducts: Product[] = Array(12)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: "Tiger",
    category: "Animals",
    price: 110.4,
    image: sampleImage,
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269,
    remaining: 1269,
  }));

const ProductGrid: React.FC = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          total={100}
          showSizeChanger={false}
          showQuickJumper={false}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
};

export default ProductGrid;
