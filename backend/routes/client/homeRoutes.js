const router = require("express").Router();
const homeControllers = require("../../controllers/client/homeControllers");

router.get("/get-categorys", homeControllers.get_categorys);
router.get("/get-products", homeControllers.get_products);
router.get("/price-range-latest-product", homeControllers.price_range_product);
router.get("/query-products", homeControllers.query_products);

router.get("/get-product-details/:slug", homeControllers.get_product_details);
router.post("/customer-review", homeControllers.customer_review);
router.get("/get-reviews/:productId", homeControllers.get_reviews);
module.exports = router;
