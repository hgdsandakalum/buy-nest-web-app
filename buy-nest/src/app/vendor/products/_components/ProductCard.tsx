// components/ProductCard.tsx
"use client";
import React from "react";
import { Card, Typography, Button, Dropdown } from "antd";
import { EllipsisOutlined, ArrowUpOutlined } from "@ant-design/icons";
import Image, { StaticImageData } from "next/image";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  image: StaticImageData;
  summary: string;
  sales: number;
  remaining: number;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Edit Product
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        Delete Product
      </a>
    ),
  },
];

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  price,
  image,
  summary,
  sales,
  remaining,
}) => {
  return (
    <Card className="w-full shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={image}
            alt={name}
            width={60}
            height={60}
            className="mr-4"
          />
          <div className="flex flex-col">
            <Title className="!m-0 !text-lg !font-bold">{name}</Title>
            <Text type="secondary" className="!text-xs">
              {category}
            </Text>
            <Text className="!font-bold">${price.toFixed(2)}</Text>
          </div>
        </div>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Button className="!px-0.5">
            <EllipsisOutlined className="text-[28px] cursor-pointer" />
          </Button>
        </Dropdown>
      </div>
      <Title level={5}>Summary</Title>
      <Text type="secondary" className="block mb-4">
        {summary}
      </Text>
      <Card size="small" className="bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <Text>Sales</Text>
          <div className="flex items-center">
            <ArrowUpOutlined className="text-green-700 mr-1" />
            <Text>{sales}</Text>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text>Remaining Products</Text>
          <div className="flex items-center">
            <Text>{remaining}</Text>
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default ProductCard;
