const router = require("express").Router();
const cardControllers = require("../../controllers/client/cardControllers");

router.post("/client/add-to-card", cardControllers.add_to_card);
router.get(
  "/client/get-card-products/:userId",
  cardControllers.get_card_products
);
router.delete(
  "/client/delete-card-product/:card_id",
  cardControllers.delete_card_product
);
router.put(
  "/client/quantity-increment/:card_id",
  cardControllers.quantity_increment
);
router.put(
  "/client/quantity-decrement/:card_id",
  cardControllers.quantity_decrement
);

router.post("/client/add-to-wishlist", cardControllers.add_to_wishlist);

router.get(
  "/client/get-wishlist-products/:userId",
  cardControllers.get_wishlist_products
);
router.delete(
  "/client/delete-wishlist-product/:wishlistId",
  cardControllers.remove_wishlist
);
module.exports = router;
