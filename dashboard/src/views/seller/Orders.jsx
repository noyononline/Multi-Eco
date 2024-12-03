import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_orders } from "../../store/Reducers/orderReducer";

const Orders = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders, totalOrder } = useSelector((state) => state.order);
  const [currentPage, setCurentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    dispatch(
      get_seller_orders({
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue,
        sellerId: userInfo._id,
      })
    );
  }, [dispatch, perPage, currentPage, searchValue, userInfo]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search
          setPerPage={setPerPage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Order Id
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Order Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Date
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {myOrders?.map((order, i) => (
                <tr key={i}>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    #{order._id}
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    ${order.price}
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <span>{order.payment_status}</span>
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <span>{order.delivery_status}</span>
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <span>{order.date}</span>
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <Link
                      to={`/seller/dashboard/order-details/${order._id}`}
                      className="p-[6px] flex justify-center items-center w-[40px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalOrder > perPage && (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurentPage}
              totalItem={totalOrder}
              parPage={perPage}
              showItem={Math.floor(totalOrder / perPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
