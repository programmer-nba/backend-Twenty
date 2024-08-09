const router = require("express").Router();
const shop = require("../../controllers/shop/shop.controller");

router.post("/", shop.create);
router.get("/", shop.getShopAll);
router.get("/:id", shop.getShopById);
router.get("/customer/:cusid", shop.getShopByCusId);
router.put("/:id", shop.updateShop);
router.delete("/:id", shop.deleteShop);

module.exports = router;