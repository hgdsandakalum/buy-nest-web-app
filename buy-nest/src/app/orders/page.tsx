/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

const { confirm } = Modal;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      let apiUrl = "";

      if (localStorage.getItem("userRole") === "VENDOR") {
        const userId = localStorage.getItem("userId");
        apiUrl = `http://localhost:5000/api/orders/vendor/${userId}`;
      } else {
        apiUrl = "http://localhost:5000/api/orders";
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data); // Debug log

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Received data is not an array:", data);
        message.error("Received invalid data format from server");
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // message.error("Failed to fetch orders");
    }
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        message.success("Order updated successfully");
        fetchOrders();
        setIsModalVisible(false);
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      message.error(error.message);
    }
  };

  const showCancelConfirm = (order) => {
    confirm({
      title: "Are you sure you want to cancel this order?",
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. This will permanently cancel the order.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleOrderCancel(order);
      },
    });
  };

  const handleOrderCancel = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order._id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        message.success("Order cancelled successfully");
        fetchOrders();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "_id" },
    {
      title: "Customer",
      dataIndex: "customerId",
      key: "customerId",
      render: (_, record) => {
        return record._id;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, record) => {
        return `$${record.totalAmount}`;
      },
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Update
          </Button>
          {localStorage.getItem("userRole") !== "VENDOR" &&
            record.status === "Processing" && (
              <Button danger onClick={() => showCancelConfirm(record)}>
                Cancel
              </Button>
            )}
        </span>
      ),
    },
  ];

  return (
    <div className="">
      <HeaderWithBreadcrumb title="All Orders" />
      <Table columns={columns} dataSource={orders} />
      <Modal
        title="Update Order"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Processing">Processing</Select.Option>
              <Select.Option value="Confirmed">Confirmed</Select.Option>
              <Select.Option value="Shipped">Shipped</Select.Option>
              <Select.Option value="Delivered">Delivered</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="shippingAddress" label="Shipping Address">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;
