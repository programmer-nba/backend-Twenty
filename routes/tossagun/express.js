const router = require("express").Router();
const express = require("../../controllers/tossagun/express.controller");
const percent = require("../../controllers/tossagun/percen.express.controller");

router.post("/price", express.getPriceList);

router.post("/percent", percent.createPercent);
router.get("/percent", percent.getPercentExpress);
router.get("/percent/:id", percent.getPercentById);
router.put("/percent/:id", percent.updatePercent);

module.exports = router;