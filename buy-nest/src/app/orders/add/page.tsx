"use client";
import { useState, useEffect } from "react";
import { Form, Button, message, Space, Select, InputNumber } from "antd";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

interface InventoryItemFormData {
  productId: string;
  quantity: number;
  lowStockThreshold: number;
}

interface Product {
  _id: string;
  name: string;
}

const AddInventoryItemPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const user = useAuthStore((state) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products");
    }
  };

  const onFinish = async (values: InventoryItemFormData) => {
    if (user?.role !== "ADMIN" && user?.role !== "VENDOR") {
      message.error("You do not have permission to add inventory items");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // Call API to add inventory item
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add inventory item");
      }

      message.success("Inventory item added successfully");
      router.push("/inventory");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      message.error("Failed to add inventory item");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  if (user?.role !== "ADMIN" && user?.role !== "VENDOR") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="">
      <HeaderWithBreadcrumb title="Add Inventory Item" />
      <div className="bg-white p-6 rounded ">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Please select a product!" }]}
          >
            <Select placeholder="Select a product">
              {products.map((product) => (
                <Select.Option key={product._id} value={product._id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="lowStockThreshold"
            label="Low Stock Threshold"
            rules={[
              {
                required: true,
                message: "Please input the low stock threshold!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="w-[200px]"
              >
                Add Item
              </Button>
              <Button size="large" htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddInventoryItemPage;
