"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import Layout from "@component/components/Layout";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

export default function Dashboard() {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setRevenue(125000);
    setSalesData([
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 4500 },
      { name: "May", sales: 6000 },
      { name: "Jun", sales: 5500 },
    ]);
    fetchVendorsCount();
    fetchInventoryCount();
    fetchProductCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/products/total/count",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProductCount(data.totalProductCount);
      } else {
        throw new Error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchInventoryCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/inventory/total/count",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInventoryCount(data.totalInventoryCount);
      } else {
        throw new Error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchVendorsCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/vendors/total/count",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVendorCount(data.totalVendorCount);
      } else {
        throw new Error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  return (
    <Layout>
      <div className="">
        <HeaderWithBreadcrumb title="Dashboard" isBreadcrumb={false} />

        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Inventory"
                value={inventoryCount}
                prefix={<Package className="mr-2" />}
              />
            </Card>
          </Col>
          {userRole !== "CSR" ? (
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Products"
                  value={productCount}
                  prefix={<ShoppingCart className="mr-2" />}
                />
              </Card>
            </Col>
          ) : null}
          {userRole !== "VENDOR" ? (
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Vendors"
                  value={vendorCount}
                  prefix={<Users className="mr-2" />}
                />
              </Card>
            </Col>
          ) : null}
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={revenue}
                prefix={<DollarSign className="mr-2" />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Sales Overview" className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Recent Products"
              extra={<a href="/vendor/products">More</a>}
            >
              {/* Add a list or table of recent products here */}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Low Stock Items" extra={<a href="/inventory">More</a>}>
              {/* Add a list or table of low stock items here */}
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
