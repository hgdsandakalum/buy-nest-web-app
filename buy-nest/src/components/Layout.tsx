/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Space,
  Layout,
  Button,
  Dropdown,
  message,
  Menu,
  ConfigProvider,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  CodeSandboxOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Image from "next/image";
import buynestLogo from "../../public/images/buynest_logo.png";
import { useAppStore, useAuthStore } from "@component/store";

const { Header, Footer, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const menuitems: MenuItem[] = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    key: "/vendor/products",
    label: "All Products",
    icon: <CodeSandboxOutlined />,
  },
  {
    key: "/vendor",
    label: "All Vendors",
    icon: <TeamOutlined />,
  },
  {
    key: "/inventory",
    label: "All Inventories",
    icon: <DatabaseOutlined />,
  },
  {
    key: "/orders",
    label: "All Orders",
    icon: <ShoppingCartOutlined />,
  },
];

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pageName, setIsLoadingAction } = useAppStore();
  const { checkAuth, user, logout } = useAuthStore();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push("/");
      } else {
        console.log("user data", user);
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key == "2") {
      handleLogout();
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "2",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setIsLoadingAction(true);
    console.log("click ", e.key);
    router.push(`${e.key}`);
    setIsLoadingAction(false);
  };

  const menuitems: MenuItem[] = useMemo(
    () => [
      {
        key: "/dashboard",
        label: "Dashboard",
        icon: <AppstoreOutlined />,
      },
      ...(userRole !== "CSR"
        ? [
            {
              key: "/vendor/products",
              label: "All Products",
              icon: <CodeSandboxOutlined />,
            },
          ]
        : []),

      ...(userRole !== "VENDOR"
        ? [
            {
              key: "/vendor",
              label: "All Vendors",
              icon: <TeamOutlined />,
            },
          ]
        : []),
      {
        key: "/inventory",
        label: "All Inventories",
        icon: <DatabaseOutlined />,
      },
      {
        key: "/orders",
        label: "All Orders",
        icon: <ShoppingCartOutlined />,
      },
      ...(userRole === "VENDOR"
        ? [
            {
              key: "/comments",
              label: "All Comments",
              icon: <CommentOutlined />,
            },
          ]
        : []),
    ],
    [userRole]
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "#003F62",
            itemSelectedColor: "#fff",
          },
        },
      }}
    >
      <Layout className="min-h-screen">
        <Header className="fixed top-0 left-0 right-0 z-10 h-24 bg-[#FAFAFA] shadow">
          <div className="flex h-full w-full items-center justify-between">
            <Image src={buynestLogo} alt="buynestLogo" height={60} />
            <Dropdown
              menu={menuProps}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Button size="large" className="font-semibold ">
                <Space>
                  {user?.role}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Layout className="mt-24">
          <Sider
            width="260px"
            className="fixed left-0 top-24 bottom-0 overflow-auto bg-[#FAFAFA]"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="grow">
                <Menu
                  onClick={onClick}
                  selectedKeys={[pageName]}
                  mode="inline"
                  items={menuitems}
                />
              </div>
              <Footer className="text-gray-600 text-xs text-center">
                © 2024 - buynest.com
              </Footer>
            </div>
          </Sider>
          <Layout className="ml-[260px]">
            <Content className="bg-[#E7E7E3] min-h-[calc(100vh-96px)] p-6 overflow-auto">
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
