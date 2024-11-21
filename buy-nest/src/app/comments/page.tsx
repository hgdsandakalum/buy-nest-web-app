/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Table, Rate, Modal, message, Button } from "antd";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

interface VendorRating {
  _id: string;
  customerId: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const VendorRatingsPage: React.FC = () => {
  const [ratings, setRatings] = useState<VendorRating[]>([]);
  const [selectedRating, setSelectedRating] = useState<VendorRating | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const apiUrl = `http://localhost:5000/api/vendors/${userId}/ratings`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data: VendorRating[] = await response.json();
        setRatings(data);
      } else {
        throw new Error("Failed to fetch ratings");
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      message.error("Failed to fetch ratings");
    }
  };

  const showModal = (rating: VendorRating) => {
    setSelectedRating(rating);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRating(null);
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: ["customerId", "name"],
      key: "customerName",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => (
        <span>
          {comment.length > 50 ? `${comment.substring(0, 50)}...` : comment}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: VendorRating) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => showModal(record)}>
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <HeaderWithBreadcrumb title="My Ratings and Comments" />
      <Table columns={columns} dataSource={ratings} />
      <Modal
        title="Rating Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRating && (
          <div>
            <p>
              <strong>Customer:</strong> {selectedRating.customerId.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRating.customerId.email}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              <Rate disabled defaultValue={selectedRating.rating} />
            </p>
            <p>
              <strong>Comment:</strong> {selectedRating.comment}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedRating.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorRatingsPage;
