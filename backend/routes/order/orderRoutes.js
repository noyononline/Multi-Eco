const router = require("express").Router();
const orderControllers = require("../../controllers/order/orderControllers");

//------------customer-------------
router.post("/client/place-order", orderControllers.place_order);
router.post("/order/create-payment", orderControllers.create_payment);
router.get("/order/confirm/:orderId", orderControllers.order_confirm);

//------------admin----------
router.get("/admin-orders", orderControllers.get_admin_orders);
router.get("/admin-order/:orderId", orderControllers.get_admin_order);
router.put(
  "/admin/order-status-update/:orderId",
  orderControllers.admin_order_status_update
);

//-----------seller---------
router.get("/seller-orders/:sellerId", orderControllers.get_seller_orders);
router.get("/seller-order/:orderId", orderControllers.get_seller_order);
router.put(
  "/seller/order-status-update/:orderId",
  orderControllers.seller_order_status_update
);
module.exports = router;
