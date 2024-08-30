const router = require("express").Router();
const receipt = require("../../controllers/more/receipt.controller");

router.get("/image/:imgname", receipt.getImage);

router.post("/", receipt.create);
router.get("/", receipt.getReceiptAll);
router.get("/:id", receipt.getReceiptById);
router.get("/code/:code", receipt.getReceiptByCode);
router.put("/upload/image/:id", receipt.uploadImage);
router.put("/:id", receipt.update);

module.exports = router;