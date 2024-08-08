const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Users } = require("../models/user.model");

const validate = (data) => {
	const schema = Joi.object({
		username: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้"),
		password: Joi.string().required().label("กรุณากรอกรหัสผ่าน"),
	});
	return schema.validate(data);
};

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });
		let user = await Users.findOne({
			username: req.body.username,
		});
		if (!user) {
			return res.status(402).send({ status: false, message: "ไม่พบข้อมูลผู้ใช้งานดังกล่าว" });
		} else {
			const validPasswordUser = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPasswordUser)
				// รหัสไม่ตรง
				return res.status(401).send({ message: "รหัสผ่านไม่ถูกต้อง", status: false, });

			const token = user.generateAuthToken();
			return res.status(200).send({ status: true, message: "เข้าสู่ระบบสำเร็จ", token: token });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
})

module.exports = router;