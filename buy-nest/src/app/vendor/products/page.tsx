/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Popconfirm,
  Input,
  Form,
  InputNumber,
  Select,
} from "antd";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

interface Product {
  _id: string;
  productId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddProductButton: React.FC = () => (
  <Button
    color="default"
    variant="solid"
    className="!py-3 h-12 font-bold !text-sm !bg-[#003F62] hover:opacity-90"
    icon={<PlusCircleOutlined />}
    href="/vendor/products/add"
  >
    ADD NEW PRODUCT
  </Button>
);

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      let apiUrl = "";
      if (user?.role === "ADMIN") {
        apiUrl = "http://localhost:5000/api/products";
      } else {
        apiUrl = `http://localhost:5000/api/products/vendor/${userId}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // message.error("Failed to fetch products");
    }
  };

  const showModal = (product: Product) => {
    console.log("selectedProduct", product);

    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    form.resetFields();
  };

  const handleUpdate = async (values: any) => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/products/${selectedProduct.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        message.success("Product updated successfully");
        fetchProducts();
        setIsModalVisible(false);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        message.success("Product deleted successfully");
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        let cat = "";
        switch (category) {
          case "electronics":
            cat = "Electronics";
            break;
          case "clothing":
            cat = "Clothing";
            break;
          case "books":
            cat = "Books";
            break;
          case "home":
            cat = "Home & Garden";
            break;
          case "beauty":
            cat = "Beauty & Personal Care";
            break;
          default:
            cat = "Other";
        }
        return cat;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Product) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          {(user?.role === "ADMIN" || user?.role === "VENDOR") && (
            <Popconfirm
              title="Are you sure you want to delete this product?"
              onConfirm={() => handleDelete(record.productId || record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <HeaderWithBreadcrumb
        title="Product Management"
        buttonComponent={
          user?.role === "ADMIN" || user?.role === "VENDOR" ? (
            <AddProductButton />
          ) : undefined
        }
      />
      <Table columns={columns} dataSource={products} />
      <Modal
        title="Update Product"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
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
              { required: true, message: "Please input the product price!" },
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
            <Select>
              <Select.Option value="electronics">Electronics</Select.Option>
              <Select.Option value="clothing">Clothing</Select.Option>
              <Select.Option value="books">Books</Select.Option>
              <Select.Option value="home">Home & Garden</Select.Option>
              <Select.Option value="beauty">
                Beauty & Personal Care
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Status"
            rules={[
              { required: true, message: "Please select the product status!" },
            ]}
          >
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
