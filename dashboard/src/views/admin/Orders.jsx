import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_admin_orders } from "../../store/Reducers/orderReducer";

const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, totalOrder } = useSelector((state) => state.order);
  const [currentPage, setCurentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setParPage] = useState(1);
  const [show, setShow] = useState("");

  useEffect(() => {
    dispatch(
      get_admin_orders({
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [dispatch, perPage, currentPage, searchValue]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search
          setSearchValue={setSearchValue}
          setPerPage={setParPage}
          searchValue={searchValue}
        />

        <div className="relative mt-5 overflow-x-auto">
          <div className="w-full text-sm text-left text-[#d0d2d6]">
            <div className="text-sm uppercase  border-b border-slate-700">
              <div className="flex justify-between items-start">
                <div className="py-3 w-[25%]">Order Id</div>
                <div className="py-3 w-[13%]">Price</div>
                <div className="py-3 w-[18%]">Payment Status</div>
                <div className="py-3 w-[18%]">Order Status</div>
                <div className="py-3 w-[18%]">action</div>
                <div className="py-3 w-[8%]">
                  <MdKeyboardArrowDown />
                </div>
              </div>
            </div>
            <div className="text-[#d0d2d6]">
              {myOrders?.map((order, i) => (
                <>
                  <div
                    key={i}
                    className="flex justify-between items-start border-b border-slate-700"
                  >
                    <div className="py-4 w-[25%] font-medium whitespace-nowrap">
                      #{order._id}
                    </div>
                    <div className="py-4 w-[13%] font-medium whitespace-nowrap">
                      ${order.price}
                    </div>
                    <div className="py-4 w-[18%] font-medium whitespace-nowrap">
                      {order.payment_status}
                    </div>
                    <div className="py-4 w-[18%] font-medium whitespace-nowrap">
                      {order.delivery_status}
                    </div>
                    <div className="py-4 w-[18%] font-medium whitespace-nowrap">
                      <Link to={`/admin/dashboard/order/details/${order._id}`}>
                        view
                      </Link>
                    </div>
                    <div
                      onClick={() => setShow(order._id)}
                      className="py-4 cursor-pointer w-[8%] font-medium whitespace-nowrap"
                    >
                      <MdKeyboardArrowDown />
                    </div>
                  </div>
                  <div
                    className={
                      show === order._id
                        ? "block border-b border-slate-700 bg-slate-800"
                        : "hidden"
                    }
                  >
                    {order.suborder?.map((sub, k) => (
                      <div
                        key={k}
                        className="flex justify-start items-start border-b border-slate-700"
                      >
                        <div className="py-4 pl-3 w-[25%] font-medium whitespace-nowrap">
                          #{sub._id}
                        </div>
                        <div className="py-4 w-[13%] font-medium whitespace-nowrap">
                          ${sub.price}
                        </div>
                        <div className="py-4 w-[18%] font-medium whitespace-nowrap">
                          {sub.payment_status}
                        </div>
                        <div className="py-4 w-[18%] font-medium whitespace-nowrap">
                          {sub.delivery_status}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          </div>
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
