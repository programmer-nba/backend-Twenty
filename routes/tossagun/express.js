const router = require("express").Router();
const express = require("../../controllers/tossagun/express/express.controller");
const percent = require("../../controllers/tossagun/express/percen.express.controller");
const box = require("../../controllers/tossagun/express/box.express.controller");

router.post("/price", express.getPriceList);
router.post("/booking", express.booking);
router.post("/label", express.labelHtml);

router.get("/booking/all", express.getBookingAll);
router.get("/booking/:id", express.getBookingById);
router.get("/booking/shop/:shopid", express.getBookingByShop);

router.post("/percent", percent.createPercent);
router.get("/percent", percent.getPercentExpress);
router.get("/percent/:id", percent.getPercentById);
router.put("/percent/:id", percent.updatePercent);

router.post("/box", box.create);
router.get("/box", box.getBoxAll);
router.get("/box/:id", box.getBoxById);
router.get("/box/shop/:shopid", box.getBoxByShop);
router.put("/box/:id", box.updateBox);
router.delete("/box/:id", box.delete);

router.post("/box/order", box.createOrder);
router.get("/box/order/shop/:shopid", box.getBoxOrderShop);

module.exports = router;