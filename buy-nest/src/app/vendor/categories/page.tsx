"use client";

import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/vendor/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/vendor/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/vendor/categories/${id}`, {
        isActive: !currentStatus,
      });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category status:", error);
      setError("Failed to update category status. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Manage Categories
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleAddCategory} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Category
            </button>
          </div>
        </form>

        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li
              key={category.id}
              className="py-4 flex justify-between items-center"
            >
              <span className="text-lg font-medium text-gray-900">
                {category.name}
              </span>
              <button
                onClick={() =>
                  handleToggleActive(category.id, category.isActive)
                }
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  category.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
