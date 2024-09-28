"use client";
import { useState, useEffect } from "react";
import HeaderWithBreadcrumb from "../../../components/HeaderWithBreadcrumb";
import ProductList from "../../../components/products/ProductList";
import Link from "next/link";
import axios from "axios";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import ProductGrid from "./_components/ProductGrid";

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  category: string;
}

const AddProductButton: React.FC = () => (
  <Button
    color="default"
    variant="solid"
    className="!py-3 h-12 font-bold !text-sm !bg-[#003F62] hover:opacity-90"
    icon={<PlusCircleOutlined />}
  >
    ADD NEW PRODUCT
  </Button>
);

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/vendor/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/vendor/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/vendor/products/${id}`, {
        isActive: !currentStatus,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return (
    <>
      <div className="">
        <HeaderWithBreadcrumb
          title="All Products"
          buttonComponent={<AddProductButton />}
        />
        <ProductGrid />
      </div>
    </>
  );
}
