import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get_dashboard_orders } from "../../store/reducers/dashboardReducer";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.dashboard);
  const [state, setState] = useState("all");

  useEffect(() => {
    dispatch(get_dashboard_orders({ status: state, customerId: userInfo.id }));
  }, [state, dispatch, userInfo]);

  const redirect = (order) => {
    let items = 0;
    for (let i = 0; i < order.length; i++) {
      items = order.products[i].quantity + items;
    }
    navigate("/payment", {
      state: {
        price: order.price,
        items,
        orderId: order._id,
      },
    });
  };
  return (
    <>
      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-600">My Orders</h2>
          <select
            className="outline-none px-3 bg-white py-1 border rounded-md text-slate-600"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="all">--order status</option>
            <option value="placed">Placed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="werehouse">Werehouse</option>
          </select>
        </div>
        <div className="pt-4">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Order Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order, i) => (
                  <tr key={i} className="bg-white border-b">
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      ${order.price}
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      {order.payment_status}
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      {order.delivery_status}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/dashboard/order-details/${order._id}`}>
                        <span className="bg-green-100 text-green-800 text-sm font-normal px-2 py-[1px] rounded">
                          View
                        </span>
                      </Link>
                      {order.payment_status !== "paid" && (
                        <span
                          onClick={() => redirect(order)}
                          className="bg-green-100 whitespace-nowrap text-green-800 ml-2 cursor-pointer text-sm font-normal px-2 py-[1px] rounded"
                        >
                          Pay Now
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
