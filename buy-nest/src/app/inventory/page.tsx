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
} from "antd";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  _id: string;
  productId: Product;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

const AddInventoryButton: React.FC = () => (
  <Button
    color="default"
    variant="solid"
    className="!py-3 h-12 font-bold !text-sm !bg-[#003F62] hover:opacity-90"
    icon={<PlusCircleOutlined />}
    href="/inventory/add"
  >
    ADD NEW INVENTORY ITEM
  </Button>
);

const InventoryManagementPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      let apiUrl = "";

      if (userRole !== "VENDOR") {
        apiUrl = "http://localhost:5000/api/inventory/all";
      } else {
        apiUrl = `http://localhost:5000/api/inventory/${userId}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data: InventoryItem[] = await response.json();
        setInventory(data);
      } else {
        throw new Error("Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      // message.error("Failed to fetch inventory");
    }
  };

  const showModal = (item: InventoryItem) => {
    setSelectedItem(item);
    form.setFieldsValue({
      ...item,
      productName: item.productId.name,
      productDescription: item.productId.description,
      productPrice: item.productId.price,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
    form.resetFields();
  };

  const handleUpdate = async (values: any) => {
    console.log("selectedItem", selectedItem);
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/inventory/${selectedItem.productId.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            quantity: values.quantity,
            lowStockThreshold: values.lowStockThreshold,
          }),
        }
      );

      if (response.ok) {
        message.success("Inventory item updated successfully");
        fetchInventory();
        setIsModalVisible(false);
      } else {
        throw new Error("Failed to update inventory item");
      }
    } catch (error) {
      console.error("Error updating inventory item:", error);
      message.error("Failed to update inventory item");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/inventory/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        message.success("Inventory item deleted successfully");
        fetchInventory();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete inventory item");
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to delete inventory item"
      );
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["productId", "name"],
      key: "productName",
    },
    {
      title: "Category",
      dataIndex: ["productId", "category"],
      key: "category",
    },
    {
      title: "Price",
      dataIndex: ["productId", "price"],
      key: "price",
      render: (price: number) => `$${price?.toFixed(2)}`,
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Stock Status",
      key: "stockStatus",
      render: (_, record: InventoryItem) => (
        <span>
          {record.quantity <= record.lowStockThreshold && (
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: "5px" }}
            />
          )}
          {record.quantity <= record.lowStockThreshold
            ? "Low Stock"
            : "In Stock"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: InventoryItem) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => showModal(record)}>
            Update
          </Button>
          {/* {(user?.role === "ADMIN" || user?.role === "VENDOR") && (
            <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => handleDelete(record.productId.productId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )} */}
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <HeaderWithBreadcrumb
        title="Inventory Management"
        buttonComponent={
          user?.role === "ADMIN" || user?.role === "VENDOR" ? (
            <AddInventoryButton />
          ) : undefined
        }
      />
      <Table columns={columns} dataSource={inventory} />
      <Modal
        title="Update Inventory Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="productName" label="Product Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="productDescription" label="Description">
            <Input.TextArea disabled />
          </Form.Item>
          <Form.Item name="productPrice" label="Price">
            <InputNumber disabled prefix="$" />
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
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
