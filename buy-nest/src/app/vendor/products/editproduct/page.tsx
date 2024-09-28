"use client";

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import ProductForm from "../../../../components/products/ProductForm";
import axios from "axios";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/vendor/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product data. Please try again.");
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await axios.put(`/api/vendor/products/${id}`, data);
      router.push("/vendor/products");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    }
  };

  if (!product) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProductForm onSubmit={handleSubmit} initialData={product} />
      </div>
    </Layout>
  );
}
