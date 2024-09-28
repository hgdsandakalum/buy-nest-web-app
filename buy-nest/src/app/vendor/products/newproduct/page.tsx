"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../../components/Layout";
import ProductForm from "../../../../components/products/ProductForm";
import axios from "axios";

export default function NewProduct() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    try {
      await axios.post("/api/vendor/products", data);
      router.push("/vendor/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Product
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}
