const router = require("express").Router();
const artwork = require("../../controllers/tossagun/artwork/artwork.controller");

router.get("/", artwork.getProductAll);
router.get("/price/:id", artwork.getProductPrice);

module.exports = router;