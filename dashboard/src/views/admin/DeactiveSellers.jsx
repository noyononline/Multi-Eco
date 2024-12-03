import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_deactive_sellers } from "../../store/Reducers/sellerReducer";
const DeactiveSellers = () => {
  const dispatch = useDispatch();
  const { sellers, totalSeller } = useSelector((state) => state.seller);
  const [currentPage, setCurentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setParPage] = useState(2);

  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_deactive_sellers(obj));
  }, [dispatch, perPage, currentPage, searchValue]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search
          setPerPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto">
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
                  Email
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sellers?.map((seller, i) => (
                <tr key={i}>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    {i + 1}
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <img
                      className="w-[45px] h-[45px]"
                      src={seller.image}
                      alt=""
                    />
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{seller.name} </span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{seller.email}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{seller.payment}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <span>{seller.status}</span>
                  </td>
                  <td className="py-1 font-medium whitespace-nowrap px-4">
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/admin/dashboard/seller/details/${seller._id}`}
                        className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalSeller <= perPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurentPage}
              totalItem={totalSeller}
              parPage={perPage}
              showItem={2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeactiveSellers;
