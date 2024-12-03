const customerAuthControllers = require("../../controllers/client/customerAuthControllers.js");

const router = require("express").Router();

router.post(
  "/client/customer-register",
  customerAuthControllers.customer_register
);

router.post("/client/customer-login", customerAuthControllers.customer_login);

module.exports = router;
