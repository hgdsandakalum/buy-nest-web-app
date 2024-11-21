/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import buynestLogo from "../../public/images/buynest_logo.png";
import { useAppStore, useAuthStore } from "@component/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { setIsLoadingAction } = useAppStore();
  const { login, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoadingAction(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        router.push("/dashboard");
      }
      setIsLoadingAction(false);
    };
    verifyAuth();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    setIsLoadingAction(true);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
      message.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
      setIsLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7e7e3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-[#fafafa] py-16 px-20 rounded shadow ">
        <div className="flex flex-col justify-center items-center">
          <Image src={buynestLogo} alt="buynestLogo" height={60} />
        </div>
        <Form
          name="login"
          className="mt-8 space-y-6"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div className="text-gray-600 text-xs text-center">
          © 2024 - buynest.com
        </div>
      </div>
    </div>
  );
}
