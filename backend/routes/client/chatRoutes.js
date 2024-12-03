const router = require("express").Router();
const chatControllers = require("../../controllers/client/chatControllers");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/client/add-customer-friend", chatControllers.add_customer_friend);
router.post(
  "/client/send-message-to-seller",
  chatControllers.send_message_to_seller
);

router.get(
  "/chat-seller/get-customers/:sellerId",
  chatControllers.get_customers
);

router.get(
  "/chat/seller/get-customer-message/:customerId",
  authMiddleware,

  chatControllers.get_customer_seller_message
);

router.post(
  "/chat-seller/send-message-to-customer",
  authMiddleware,
  chatControllers.seller_message_add
);

router.get(
  "/chat/admin/get-sellers",
  authMiddleware,
  chatControllers.get_sellers
);

router.post(
  "/chat/message-send-seller-admin",
  authMiddleware,
  chatControllers.seller_admin_message_insert
);
router.get(
  "/chat/get-admin-messages/:receverId",
  authMiddleware,
  chatControllers.get_admin_messages
);
router.get(
  "/chat/get-seller-messages",
  authMiddleware,
  chatControllers.get_seller_messages
);
module.exports = router;
