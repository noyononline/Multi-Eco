const router = require("express").Router();
const dashboardControllers = require("../../controllers/client/dashboardControllers");

router.get(
  "/customer/get-dashboard-data/:userId",
  dashboardControllers.customer_dashboard_data
);
router.get(
  "/customer/get-dashboard-order/:customerId/:status",
  dashboardControllers.customer_dashboard_orders
);
router.get(
  "/customer/get-order-details/:orderId",
  dashboardControllers.get_order_details
);

module.exports = router;
