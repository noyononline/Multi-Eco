import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_order_details } from "../../store/reducers/dashboardReducer";
import { Link, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  console.log(orderId);

  const dispatch = useDispatch();
  const { viewOrder } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_order_details(orderId));
  }, [orderId, dispatch]);
  return (
    <div className="bg-white p-5">
      <h2 className="text-slate-600 font-semibold">
        #{viewOrder._id} , <span className="pl-1">{viewOrder.date}</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-600 font-semibold">
            Deliver to: {viewOrder.shippingInfo?.name}
          </h2>
          <p>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Home
            </span>
            <span className="text-slate-600 text-sm">
              {viewOrder.shippingInfo?.address}
              {viewOrder.shippingInfo?.province}
              {viewOrder.shippingInfo?.city}
              {viewOrder.shippingInfo?.area}
            </span>
          </p>
          <p className="text-slate-600 text-sm font-semibold">
            Email to {userInfo.email}
          </p>
        </div>
        <div className="text-slate-600">
          <h2>Price: ${viewOrder.price} include shipping fee</h2>
          <p>
            Payment status:{" "}
            <span
              className={`py-[1px] text-xs px-3 ${
                viewOrder.payment_status === "paid"
                  ? "bg-green-100 text-gray-800"
                  : "bg-red-100 text-red-800"
              } rounded-md`}
            >
              {viewOrder.payment_status}
            </span>
          </p>
          <p>
            {" "}
            Delivery status :
            <span
              className={`py-[1px] text-xs px-3 ${
                viewOrder.delivery_status === "paid"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-red-100 text-red-800"
              } rounded-md`}
            >
              {viewOrder.delivery_status}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="text-slate-600 text-lg pb-2">Products</h2>
        <div className="flex gap-5 flex-col">
          {viewOrder.products?.map((p, i) => (
            <div key={i}>
              <div className="flex gap-5 justify-start items-center text-slate-600">
                <div className="flex gap-2">
                  <img
                    className="w-[55px] h-[55px]"
                    src={p.images[0]}
                    alt={p.name}
                  />

                  <div className="flex text-sm flex-col justify-start items-start">
                    <Link>{p.name}</Link>
                    <p>
                      <span>Brand: {p.brand}</span>
                      <span>Quantity: {p.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="pl-4">
                  <h2 className="text-md text-orange-500">
                    ${p.price - Math.floor((p.price * p.discount) / 100)}
                  </h2>
                  <p>{p.price}</p>
                  <p>-{p.discount}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
