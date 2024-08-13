const router = require("express").Router();
const wallet = require("../../controllers/shop/wallet.controller");
const history = require("../../controllers/shop/wallet.history.controller");

router.get("/image/:imgname", wallet.getImage);

router.post("/", wallet.create);
router.get("/", wallet.getWalletAll);
router.get("/:id", wallet.getWalletById);
router.put("/:id", wallet.updateWallet);

router.post("/history", history.create);
router.get("/history", history.getWalletHistory);
router.get("/history/:id", history.getWalletHistoryById);
router.get("/history/shop/:shopid", history.getWalletHistoryByShop);

module.exports = router;