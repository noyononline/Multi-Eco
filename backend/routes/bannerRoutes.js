const router = require("express").Router();

const bannerControllers = require("../controllers/bannerControllers");

router.post("/banner/add", bannerControllers.banner_add);
router.get("/banner/get/:productId", bannerControllers.get_banner);
router.put("/banner/update/:bannerId", bannerControllers.update_banner);
router.get("/banners", bannerControllers.get_banners);

module.exports = router;
