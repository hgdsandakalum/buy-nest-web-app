/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Table, Button, Rate, Modal, message, Popconfirm } from "antd";
import Image from "next/image";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

interface Vendor {
  id: string;
  name: string;
  averageRating: number;
  totalRatings: number;
  image?: string;
  description?: string;
  address?: string;
  contact?: string;
}

const AddVenderButton: React.FC = () => (
  <Button
    color="default"
    variant="solid"
    className="!py-3 h-12 font-bold !text-sm !bg-[#003F62] hover:opacity-90"
    icon={<PlusCircleOutlined />}
    href="/vendor/createvendor"
  >
    ADD NEW VENDOR
  </Button>
);

const VendorListingPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/vendors", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data: Vendor[] = await response.json();
        setVendors(data);
      } else {
        throw new Error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const showModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    console.log("vendorId", vendor);

    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (vendorId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/vendors/${vendorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        message.success("Vendor deleted successfully");
        fetchVendors(); // Refresh the vendor list
      } else {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      message.error("Failed to delete vendor");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Average Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (averageRating: number, record: Vendor) => (
        <span className="flex items-center gap-2">
          <Rate disabled defaultValue={averageRating} allowHalf />
          <span className="ant-rate-text">({record.totalRatings})</span>
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Vendor) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => showModal(record)}>
            View Details
          </Button>
          {user?.role === "ADMIN" && (
            <Popconfirm
              title="Are you sure you want to delete this vendor?"
              onConfirm={() => handleDelete(record._id)}
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
        title="All Vendors"
        buttonComponent={
          user?.role === "ADMIN" ? <AddVenderButton /> : undefined
        }
      />
      <Table columns={columns} dataSource={vendors} />
      <Modal
        title={selectedVendor?.name}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedVendor && (
          <div className="flex gap-4">
            <div>
              <Image
                alt={selectedVendor.name}
                src={selectedVendor.image || "/placeholder.jpg"}
                width={100}
                height={100}
              />
            </div>
            <div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <Rate
                    disabled
                    defaultValue={selectedVendor.averageRating}
                    allowHalf
                  />
                  {selectedVendor.averageRating} ({selectedVendor.totalRatings}{" "}
                  ratings)
                </div>
              </div>
              <p>
                <strong>Description:</strong> {selectedVendor.description}
              </p>
              <p>
                <strong>Address:</strong> {selectedVendor.address}
              </p>
              <p>
                <strong>Contact:</strong> {selectedVendor.contact}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorListingPage;
