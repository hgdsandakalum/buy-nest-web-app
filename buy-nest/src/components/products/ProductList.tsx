import React from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {products.map((product) => (
        <li key={product.id} className="py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                product.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="space-x-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
