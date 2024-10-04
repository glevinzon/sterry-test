"use client";

import React, { useState, FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductDocument } from "@/models/Product";
import { toast } from "react-toastify";
import ProductTable from "./components/productTable";

type FormInput = Omit<ProductDocument, "_id">;

type ProductsType = {
  products: ProductDocument[];
};

const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  category: yup.string().required("Category is required"),
  brand: yup.string().required("Brand is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number"),
});

const DashboardPage: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const notify = (
    message: string,
    type: "info" | "success" | "warning" | "error" | "default"
  ) =>
    toast(message, {
      position: "bottom-center",
      isLoading: false,
      type: type,
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: FormInput & { id?: string }) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/api/product/?id=${data.id}` : "/api/product";
      return await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(async (res) => await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
      reset();
      setEditingProductId(null);
      notify("Saving product success", "success");
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: string) =>
      await fetch(`/api/product/?id=${id}`, {
        method: "DELETE",
      }).then(async (res) => await res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notify("Product deleted", "info");
    },
  });

  const onSubmit = async (data: FormInput) => {
    mutate(data);
  };

  const {
    isPending: isFetching,
    error,
    data,
  } = useQuery<ProductsType>({
    queryKey: ["products"],
    queryFn: async () =>
      await fetch("/api/product").then(async (res) => await res.json()),
  });

  const handleEdit = (product: ProductDocument) => {
    setEditingProductId(product._id);
    setShowForm(true);
    setValue("name", product.name);
    setValue("category", product.category);
    setValue("brand", product.brand);
    setValue("description", product.description);
    setValue("price", product.price);
  };

  if (isFetching)
    return (
      <p className="flex justify-center items-center h-screen">Loading...</p>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <section className="min-h-full bg-gray-50 p-3 sm:p-5">
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Product
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            A list of products available for purchase.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          type="button"
          className="flex-none justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add product
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-md mx-auto p-4 mt-4 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Product Information</h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.name && (
                <div className="py-1.5 text-red-500 text-xs">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category
              </label>
              <input
                type="text"
                {...register("category")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.category && (
                <div className="py-1.5 text-red-500 text-xs">
                  {errors.category.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="brand"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Brand
              </label>
              <input
                type="text"
                {...register("brand")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.brand && (
                <div className="py-1.5 text-red-500 text-xs">
                  {errors.brand.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.description && (
                <div className="py-1.5 text-red-500 text-xs">
                  {errors.description.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <input
                type="number"
                {...register("price")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.price && (
                <div className="py-1.5 text-red-500 text-xs">
                  {errors.price.message}
                </div>
              )}
            </div>
            <div className="text-right flex flex-row gap-2">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading
                  ? "Saving..."
                  : editingProductId
                  ? "Update"
                  : "Create"}
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mx-auto p-4 ">
        <ProductTable
          products={data.products}
          handleEdit={handleEdit}
          handleDelete={deleteProduct}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
