import { FC } from "react";
import { ProductDocument } from "@/models/Product";

type Props = {
  products: ProductDocument[];
  handleEdit: (item: ProductDocument) => void;
  handleDelete: (id: string) => void;
};

const Products: FC<Props> = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
            <tr>
              <th scope="col" className="px-4 py-3">
                Product name
              </th>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Brand
              </th>
              <th scope="col" className="px-4 py-3">
                Description
              </th>
              <th scope="col" className="px-4 py-3">
                Price
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              return (
                <tr key={item._id} className="border-b ">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {item.name}
                  </th>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.brand}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.price}</td>
                  <td className="px-4 py-3 flex items-center justify-end">
                    <button
                      onClick={() => handleEdit(item)}
                      className="block py-2 px-4 hover:bg-gray-100 "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
