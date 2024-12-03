import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { GiKnightBanner } from "react-icons/gi";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../../store/Reducers/productReducer";

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);
  const [currentPage, setCurentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setParPage] = useState(5);

  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
  }, [searchValue, currentPage, perPage, dispatch]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Category
                </th>
                <th scope="col" className="py-3 px-4">
                  Brand
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Discount
                </th>
                <th scope="col" className="py-3 px-4">
                  Stock
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i}>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    {i + 1}
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <img
                      className="w-[45px] h-[45px]"
                      src={product.images[0]}
                      alt=""
                    />
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{product?.name?.slice(0, 19)}...</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{product.category}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{product.brand}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>${product.price}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    {product.discount === 0 ? (
                      <span>No Discount</span>
                    ) : (
                      <span>{product.discount}%</span>
                    )}
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{product.stock}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/seller/dashboard/edit-product/${product._id}`}
                        className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <FaEdit />
                      </Link>
                      <Link className="p-[6px] bg-orange-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>
                      <button className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                        <FaTrash />
                      </button>
                      <Link
                        to={`/seller/dashboard/add-banner/${product._id}`}
                        className="p-[6px] bg-cyan-500 rounded hover:shadow-lg hover:shadow-cyan-500/50"
                      >
                        <GiKnightBanner />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalProduct <= perPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurentPage}
              totalItem={50}
              parPage={perPage}
              showItem={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
