const router = require("express").Router();
const user = require("../controllers/user.controller");

router.post("/", user.create);
router.get("/", user.getUserAll);
router.get("/employee", user.getEmployee);
router.get("/customer", user.getCustomer);
router.get("/:id", user.getUserById);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);

module.exports = router;