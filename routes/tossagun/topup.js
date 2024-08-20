const router = require("express").Router();
const percent = require("../../controllers/tossagun/topup/percent.express.controller");

router.post("/percent", percent.createPercent);
router.get("/percent", percent.getPercentTopup);
router.get("/percent/:id", percent.getPercentById);
router.put("/percent/:id", percent.updatePercent);
router.delete("/percent/:id", percent.deletePercent);

module.exports = router; 