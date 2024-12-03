import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_dashboard_index_data } from "../../store/reducers/dashboardReducer";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { totalOrders, pendingOrder, cancelledOrder, recentOrders } =
    useSelector((state) => state.dashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(get_dashboard_index_data(userInfo.id));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userInfo]);

  const redirect = (order) => {
    const items = order.products.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    navigate("/payment", {
      state: {
        price: order.price,
        items,
        orderId: order._id,
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-1 gap-5">
        <div className="flex justify-center items-center p-5 bg-white rounded-md gap-5">
          <div className="bg-green-100 w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-green-800">
              <AiOutlineShoppingCart />
            </span>
          </div>
          <div className="flex flex-col justify-start items-center text-slate-600">
            <h2 className="text-3xl font-bold">{totalOrders}</h2>
            <span>Orders</span>
          </div>
        </div>
        <div className="flex justify-center items-center p-5 bg-white rounded-md gap-5">
          <div className="bg-blue-100 w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-blue-800">
              <AiOutlineShoppingCart />
            </span>
          </div>
          <div className="flex flex-col justify-start items-center text-slate-600">
            <h2 className="text-3xl font-bold">{pendingOrder}</h2>
            <span>Pending Orders</span>
          </div>
        </div>
        <div className="flex justify-center items-center p-5 bg-white rounded-md gap-5">
          <div className="bg-red-100 w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl">
            <span className="text-xl text-red-800">
              <AiOutlineShoppingCart />
            </span>
          </div>
          <div className="flex flex-col justify-start items-center text-slate-600">
            <h2 className="text-3xl font-bold">{cancelledOrder}</h2>
            <span>Cancelled Orders</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 mt-5 rounded-md">
        <h2 className="text-lg font-semibold text-slate-600">Recent Orders</h2>
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="bg-white border-b">
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
