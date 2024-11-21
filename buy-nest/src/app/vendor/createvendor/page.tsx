"use client";
import { useState } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@component/store";
import HeaderWithBreadcrumb from "@component/components/HeaderWithBreadcrumb";

interface VendorFormData {
  name: string;
  email: string;
  password: string;
  description: string;
  address: string;
  contact: string;
  image: string;
}

const CreateVendorPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [form] = Form.useForm();

  const onFinish = async (values: VendorFormData) => {
    if (user?.role !== "ADMIN") {
      message.error("You do not have permission to create vendors");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // Call API to create vendor
      const response = await fetch("http://localhost:5000/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create vendor");
      }

      message.success("Vendor created successfully");
      router.push("/vendor");
    } catch (error) {
      console.error("Error creating vendor:", error);
      message.error("Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  if (user?.role !== "ADMIN") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="">
      <HeaderWithBreadcrumb title="Create Vendor" />
      <div className="bg-white p-6 rounded ">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <Form.Item
                name="name"
                label="Vendor Name"
                rules={[
                  { required: true, message: "Please input the vendor name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input the password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please input the vendor address!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="contact"
                label="Contact Number"
                rules={[
                  {
                    required: true,
                    message: "Please input the contact number!",
                  },
                  {
                    pattern: /^[0-9-+()]*$/,
                    message: "Please enter a valid phone number!",
                  },
                ]}
              >
                <Input />
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
                Submit
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

export default CreateVendorPage;
