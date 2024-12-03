import React, { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";

const DiscountProducts = () => {
  const [currentPage, setCurentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setParPage] = useState(5);
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
                  Stpck
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((d, i) => (
                <tr key={i}>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    {d}
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <img
                      className="w-[45px] h-[45px]"
                      src={`http://localhost:3000/images/category/${d}.jpg`}
                      alt=""
                    />
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>Mens Cloths T-shirt</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>Sports</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>Eazy</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>$45</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>5%</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>10</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <div className="flex justify-start items-center gap-4">
                      <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEdit />
                      </Link>
                      <Link className="p-[6px] bg-orange-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>
                      <button className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurentPage}
            totalItem={50}
            parPage={perPage}
            showItem={1}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscountProducts;
