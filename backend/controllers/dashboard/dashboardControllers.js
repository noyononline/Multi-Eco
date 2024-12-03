const sellerWallet = require("../../models/sellerWallet");
const sellerModel = require("../../models/sellerModel");
const myShopWallet = require("../../models/myShopWallet");
const productModel = require("../../models/productModel");
const authOrderModel = require("../../models/order/authOrderModel");
const customerOrderModel = require("../../models/order/customerOrderModel");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");
const {
  mongo: { ObjectId },
} = require("mongoose");

const { responseReturn } = require("../../utiles/response");

module.exports.get_seller_dashboard_data = async (req, res) => {
  const { id } = req;

  try {
    const totalSele = await sellerWallet.aggregate([
      {
        $match: {
          sellerId: {
            $eq: id,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales = await sellerWallet.aggregate([
      {
        $match: {
          sellerId: {
            $eq: id,
          },
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          amount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalOrders = await authOrderModel.aggregate([
      {
        $match: { sellerId: new ObjectId(id) },
      },
      {
        $project: {
          month: { $month: "$orderDate" },
          year: { $year: "$orderDate" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalSalesCount = await authOrderModel.aggregate([
      {
        $match: { sellerId: new ObjectId(id) },
      },
      {
        $project: {
          month: { $month: "$orderDate" },
          year: { $year: "$orderDate" },
          productCount: { $size: "$products" }, // Assuming 'products' is an array of ordered items
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          salesCount: { $sum: "$productCount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = {
      orders: [],
      revenue: [],
      sales: [],
      months: [],
    };

    // Merge all the data for the months
    const fillDataForMonths = (aggData, chartType) => {
      let data = {};
      aggData.forEach((item) => {
        const monthIndex = item._id.month - 1; // Convert month number (1-12) to index (0-11)
        const value = item[chartType];
        data[monthIndex] = value;
      });
      return Object.values(data);
    };

    chartData.orders = fillDataForMonths(totalOrders, "orderCount");
    chartData.revenue = fillDataForMonths(totalSales, "totalAmount");
    chartData.sales = fillDataForMonths(totalSalesCount, "salesCount");

    // Fill missing months with zeroes if no data exists
    chartData.orders = chartData.orders.length
      ? chartData.orders
      : new Array(12).fill(0);
    chartData.revenue = chartData.revenue.length
      ? chartData.revenue
      : new Array(12).fill(0);
    chartData.sales = chartData.sales.length
      ? chartData.sales
      : new Array(12).fill(0);

    // Fill the months names (January to December)
    chartData.months = months;

    const totalProduct = await productModel
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();

    const totalOrder = await authOrderModel
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();

    const totalPendingOrder = await authOrderModel
      .find({
        $and: [
          {
            sellerId: {
              $eq: new ObjectId(id),
            },
          },
          {
            delivery_status: {
              $eq: "pending",
            },
          },
        ],
      })
      .countDocuments();

    const recentOrders = await authOrderModel
      .find({
        sellerId: new ObjectId(id),
      })
      .limit(5);

    const messages = await sellerCustomerMessage
      .find({
        $or: [
          {
            senderId: {
              $eq: id,
            },
          },
          {
            receverId: {
              $eq: id,
            },
          },
        ],
      })
      .limit(3);

    responseReturn(res, 200, {
      totalOrder,
      totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
      totalPendingOrder,
      messages,
      recentOrders,
      totalProduct,
      orders: chartData.orders,
      revenue: chartData.revenue,
      sales: chartData.sales,
      months: chartData.months,
    });
  } catch (error) {
    responseReturn(res, 500, { message: "Internal server error" });
  }
};

module.exports.get_admin_dashboard_data = async (req, res) => {
  // const { id } = req;
  try {
    const totalSele = await myShopWallet.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales = await myShopWallet.aggregate([
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          amount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalOrders = await customerOrderModel.aggregate([
      {
        $project: {
          month: { $month: "$orderDate" },
          year: { $year: "$orderDate" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalSalesCount = await customerOrderModel.aggregate([
      {
        $project: {
          month: { $month: "$orderDate" },
          year: { $year: "$orderDate" },
          productCount: { $size: "$products" }, // Assuming 'products' is an array of ordered items
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          salesCount: { $sum: "$productCount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = {
      orders: [],
      revenue: [],
      sales: [],
      months: [],
    };

    // Merge all the data for the months
    const fillDataForMonths = (aggData, chartType) => {
      let data = {};
      aggData.forEach((item) => {
        const monthIndex = item._id.month - 1; // Convert month number (1-12) to index (0-11)
        const value = item[chartType];
        data[monthIndex] = value;
      });
      return Object.values(data);
    };

    chartData.orders = fillDataForMonths(totalOrders, "orderCount");
    chartData.revenue = fillDataForMonths(totalSales, "totalAmount");
    chartData.sales = fillDataForMonths(totalSalesCount, "salesCount");

    // Fill missing months with zeroes if no data exists
    chartData.orders = chartData.orders.length
      ? chartData.orders
      : new Array(12).fill(0);
    chartData.revenue = chartData.revenue.length
      ? chartData.revenue
      : new Array(12).fill(0);
    chartData.sales = chartData.sales.length
      ? chartData.sales
      : new Array(12).fill(0);

    // Fill the months names (January to December)
    chartData.months = months;

    console.log(chartData);

    const totalProduct = await productModel.find({}).countDocuments();
    const totalOrder = await customerOrderModel.find({}).countDocuments();
    const totalSeller = await sellerModel.find({}).countDocuments();
    const messages = await adminSellerMessage.find({}).limit(3);
    const recentOrders = await customerOrderModel.find({}).limit(5);

    responseReturn(res, 200, {
      totalOrder,
      totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
      totalSeller,
      messages,
      recentOrders,
      totalProduct,
      orders: chartData.orders,
      revenue: chartData.revenue,
      sales: chartData.sales,
      months: chartData.months,
    });
  } catch (error) {
    responseReturn(res, 500, { message: "Internal server error" });
  }
};
