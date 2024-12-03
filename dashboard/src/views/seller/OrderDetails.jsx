import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_seller_order,
  messageClear,
  seller_order_status_update,
} from "../../store/Reducers/orderReducer";

import toast from "react-hot-toast";
const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  const status_update = (e) => {
    dispatch(
      seller_order_status_update({ orderId, info: { status: e.target.value } })
    );
    setStatus(e.target.value);
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl text-[#d0d2d6]">Order Details</h2>
          <select
            value={status}
            onChange={status_update}
            name=""
            id=""
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="p-4">
          <div className="flex gap-2 text-lg text-[#d0d2d6]">
            <h2>#{order?._id}</h2>
            <span>{order?.date}</span>
          </div>
          <div className="flex flex-wrap">
            <div className="w-[50%]">
              <div className="pr-3 text-[#d0d2d6] text-lg">
                <div className="flex flex-col gap-1">
                  <h2 className="pb-2 font-semibold">
                    Deliver to : {order?.shippingInfo}
                  </h2>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <h2>Payment Status : </h2>
                  <span className="text-base">{order?.payment_status}</span>
                </div>
                <span>Price : ${order?.price}</span>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="text-[#d0d2d6]">
                    {order?.products?.map((o, i) => (
                      <div key={i} className="flex gap-3 text-md">
                        <img
                          className="w-[60px] h-[60px] mt-1"
                          src={o.images[0]}
                          alt={o.name}
                        />
                        <div>
                          <h2>{o.name}</h2>
                          <p className="flex whitespace-normal">
                            <span>Brand : </span>
                            <span>{o.brand}, </span>
                            <span className="text-lg">
                              Quality : {o.quantity}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
