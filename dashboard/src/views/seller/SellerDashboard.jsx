import React, { useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import customer from "../../assist/seller.png";
import { get_seller_dashboard_index_data } from "../../store/Reducers/dashboardReducer";

const SellerDashoard = () => {
  const dispatch = useDispatch();

  const {
    totalSale,
    totalProduct,
    totalOrder,
    totalPendingOrder,
    recentOrders,
    recentMessage,
    chartData,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_seller_dashboard_index_data());
  }, [dispatch]);

  const months = moment.months();
  const currentMonthIndex = moment().month();
  const dynamicMonths = months.slice(0, currentMonthIndex + 1);
  const state = {
    series: [
      {
        name: "Orders",
        data: chartData?.orders || [],
      },
      {
        name: "Revenue",
        data: chartData?.revenue || [],
      },
      {
        name: "Sales",
        data: chartData.sales || [],
      },
    ],
    options: {
      color: ["#181ee8", "#181ee8", "#ff9900"],
      plotOptions: {
        radius: 30,
      },
      chart: {
        background: "transparent",
        foreColor: "#d0d2d6",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: ["smooth", "smooth", "smooth"],
        lineCap: "butt",
        colors: "#f0f0f0",
        width: 1,
        dashArray: 0,
      },
      xaxis: {
        categories: dynamicMonths,
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 0,
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
      responsive: [
        {
          breakpoint: 565,
          yaxis: {
            categories: chartData.months || [],
          },
          options: {
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            chart: {
              height: "550px",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-3xl font-bold">${totalSale}</h2>
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#28c76f] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
            <span className="text-md font-medium">Products</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <RiProductHuntLine className="text-[#cd00e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span className="text-md font-medium">Order</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <AiOutlineShoppingCart className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#7367f01f] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-3xl font-bold">{totalPendingOrder}</h2>
            <span className="text-md font-medium">Pending Orders</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <AiOutlineShoppingCart className="text-[#7367f0] shadow-lg" />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap mt-7">
        <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-[#283046] p-4 rounded-md">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="w-full lg:w-5/12 mt-5 lg:mt-0">
          <div className="w-full bg-[#283046] p-4 rounded-md text-[#d0d2d6]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">
                Recent customer message
              </h2>
              <Link
                to={"/seller/dashboard/chat-customer"}
                className="font-semibold text-sm text-[#d0d2d6]"
              >
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-4 text-[#d0d2d6]">
              <ol className="relative border-1 border-slate-600 ml-4">
                {recentMessage?.map((sms, k) => (
                  <li key={k} className="mb-3 ml-6">
                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00d1e848] rounded-full z-10">
                      {sms.senderId === userInfo._id ? (
                        <img
                          className="w-full h-full rounded-full shadow-lg"
                          src={userInfo.image}
                          alt="smm panel"
                        />
                      ) : (
                        <img
                          className="w-full h-full rounded-full shadow-lg"
                          src={customer}
                          alt="smm panel"
                        />
                      )}
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Link
                          to={`/seller/dashboard/chat-customer/`}
                          className="text-md font-normal"
                        >
                          {sms.senderName}
                        </Link>
                        <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">
                          {moment(sms.createdAt).startOf("hour").fromNow()}
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800">
                        {sms.message}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-[#283046] rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">
            Recent Orders
          </h2>
          <Link
            to={"/seller/dashboard/orders"}
            className="font-semibold text-sm text-[#d0d2d6]"
          >
            View All
          </Link>
        </div>
        <div className="relative overflow-x-auto">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((recentOrder, i) => (
                <tr key={i}>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    #{recentOrder._id}
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    ${recentOrder.price}
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <span>{recentOrder.payment_status}</span>
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <span>{recentOrder.delivery_status}</span>
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap px-4">
                    <Link
                      to={`/seller/dashboard/order-details/${recentOrder._id}`}
                    >
                      view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashoard;
