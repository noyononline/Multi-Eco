const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const paymentControllers = require("../controllers/payment/paymentControllers");

router.get(
  "/payment/create-stripe-connect-account",
  authMiddleware,
  paymentControllers.create_stripe_connect_account
);

router.put(
  "/payment/active-stripe-connect-account/:activeCode",
  authMiddleware,
  paymentControllers.active_stripe_connect_account
);

router.get(
  "/payment/get-seller-payment-details/:sellerId",
  authMiddleware,
  paymentControllers.get_seller_payemt_details
);

router.post(
  "/payment/withdrowal-request",
  authMiddleware,
  paymentControllers.withdrowal_request
);

router.get(
  "/payment-request-admin",
  authMiddleware,
  paymentControllers.get_payment_request_admin
);

router.post(
  "/payment/request-confirm",
  authMiddleware,
  paymentControllers.payment_request_admin_confirm
);

module.exports = router;
