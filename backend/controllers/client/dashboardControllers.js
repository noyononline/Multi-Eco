const customerOrderModel = require("../../models/order/customerOrderModel");
const { responseReturn } = require("../../utiles/response");
const {
  mongo: { ObjectId },
} = require("mongoose");
class dashboardControllers {
  customer_dashboard_data = async (req, res) => {
    const { userId } = req.params;

    try {
      const recentOrders = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
        })
        .limit(5);
      const pendingOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "pending",
        })
        .countDocuments();
      const totalOrders = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
        })
        .countDocuments();
      const cancelledOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "cancelled",
        })
        .countDocuments();

      responseReturn(res, 201, {
        recentOrders,
        pendingOrder,
        cancelledOrder,
        totalOrders,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_dashboard_orders = async (req, res) => {
    const { customerId, status } = req.params;

    try {
      let orders = [];
      if (status !== "all") {
        orders = await customerOrderModel.find({
          customerId: new ObjectId(customerId),
          delivery_status: status,
        });
      } else {
        orders = await customerOrderModel.find({
          customerId: new ObjectId(customerId),
        });
      }
      responseReturn(res, 200, { orders });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_order_details = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order_details = await customerOrderModel.findById(orderId);
      responseReturn(res, 200, { order_details });
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new dashboardControllers();
