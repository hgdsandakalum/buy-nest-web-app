"use client";
import React from "react";
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
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Image from "next/image";
import buynestLogo from "../../public/images/buynest_logo.png";
import { useAppStore } from "@component/store";

const { Header, Footer, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const handleMenuClick: MenuProps["onClick"] = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

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
    key: "sub1",
    label: "Categories",
    icon: <DatabaseOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "7", label: "Option 7" },
          { key: "8", label: "Option 8" },
        ],
      },
    ],
  },
];

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pageName, setIsLoadingAction } = useAppStore();

  console.log("pageName", pageName);

  const onClick: MenuProps["onClick"] = (e) => {
    setIsLoadingAction(true);
    console.log("click ", e.key);
    router.push(`${e.key}`);
    setIsLoadingAction(false);
  };
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
                  Admin
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
