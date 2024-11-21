"use client";
import { useState } from "react";
import { Form, Input, Button, message, Space, InputNumber, Select } from "antd";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const { Option } = Select;

const AddNewProductPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [form] = Form.useForm();

  const onFinish = async (values: ProductFormData) => {
    if (user?.role !== "ADMIN" && user?.role !== "VENDOR") {
      message.error("You do not have permission to add new products");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // Call API to add new product
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add new product");
      }

      message.success("Product added successfully");
      router.push("/vendor/products");
    } catch (error) {
      console.error("Error adding new product:", error);
      message.error("Failed to add new product");
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
      <HeaderWithBreadcrumb title="Add New Product" />
      <div className="bg-white p-6 rounded ">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please input the product description!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: "Please input the product price!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select the product category!",
                  },
                ]}
              >
                <Select placeholder="Select a category">
                  <Option value="electronics">Electronics</Option>
                  <Option value="clothing">Clothing</Option>
                  <Option value="books">Books</Option>
                  <Option value="home">Home & Garden</Option>
                  <Option value="beauty">Beauty & Personal Care</Option>
                  {/* Add more categories as needed */}
                </Select>
              </Form.Item>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[
                  { required: true, message: "Please input the image URL!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="w-[200px]"
              >
                Add Product
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

export default AddNewProductPage;
