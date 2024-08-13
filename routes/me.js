const router = require("express").Router();
const auth = require("../lib/auth");
const { Users } = require("../models/user.model");

router.post("/", auth, async (req, res) => {
	const { decoded } = req;
	try {
		const id = decoded.id;
		const user = await Users.findOne({ _id: id });
		if (!user)
			return res.status(402).send({ status: false, message: 'ไม่พบข้อมูลผู้ใช้งานดังกล่าว' })
		return res.status(201).send({ name: user.fristname, position: user.position, status: user.status, data: user });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
});

module.exports = router;