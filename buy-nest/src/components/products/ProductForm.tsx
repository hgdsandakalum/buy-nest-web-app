"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

interface ProductFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/vendor/categories");
      setCategories(
        response.data.filter((category: Category) => category.isActive)
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  ): string => {
    if (typeof error === "string") {
      return error;
    } else if (error?.message) {
      return error.message.toString();
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(errors.name)}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(errors.description)}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          {...register("price", { required: "Price is required", min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(errors.price)}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          {...register("categoryId", { required: "Category is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(errors.categoryId)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="isActive" className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
