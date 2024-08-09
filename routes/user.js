const router = require("express").Router();
const user = require("../controllers/user.controller");

router.post("/", user.create);
router.get("/", user.getUserAll);
router.get("/admin", user.getAdmin);
router.get("/customer", user.getCustomer);
router.get("/employee", user.getEmployee);
router.get("/:id", user.getUserById);
router.get("/shop/:shopid", user.getEmployeeByShopId);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);

module.exports = router;