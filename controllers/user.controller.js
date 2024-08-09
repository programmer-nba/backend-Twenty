const bcrypt = require("bcrypt");
const { Users, validate } = require("../models/user.model");

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res
				.status(400)
				.send({ message: error.details[0].message, status: false });

		const user = await Users.findOne({
			username: req.body.username,
		});
		if (user) {
			return res.status(409).send({
				status: false,
				message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
			});
		} else {
			const salt = await bcrypt.genSalt(Number(process.env.SALT));
			const hashPassword = await bcrypt.hash(req.body.password, salt);

			await new Users({
				...req.body,
				password: hashPassword,
			}).save();
			return res.status(201).send({ message: "สร้างข้อมูลสำเร็จ", status: true });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getUserAll = async (req, res) => {
	try {
		const user = await Users.find();
		if (!user) {
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		} else {
			return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getUserById = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await Users.findOne({ _id: id });
		if (!user) {
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		} else {
			return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		if (!req.body.password) {
			Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
				if (!data) {
					return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
				} else {
					return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
				}
			}).catch((err) => {
				return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
			})
		} else {
			const salt = await bcrypt.genSalt(Number(process.env.SALT));
			const hashPassword = await bcrypt.hash(req.body.password, salt);
			Users.findByIdAndUpdate(id, { ...req.body, password: hashPassword }, { useFindAndModify: false }).then((data) => {
				if (!data) {
					return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
				} else {
					return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
				}
			}).catch((err) => {
				return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
			})
		}

	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		Users.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: "ลบข้อมูลผู้ใช้งานไม่สำเร็จ" })
			} else {
				return res.status(203).send({ status: true, message: 'ลบข้อมูลผู้ใช้งานสำเร็จ' })
			}
		}).catch((err) => {
			return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getAdmin = async (req, res) => {
	try {
		const pipelint = [
			{
				$match: {
					position: 'admin'
				}
			}
		];
		const user = await Users.aggregate(pipelint);
		if (!user)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};


module.exports.getEmployee = async (req, res) => {
	try {
		const pipelint = [
			{
				$match: {
					position: 'employee'
				}
			}
		];
		const user = await Users.aggregate(pipelint);
		if (!user)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getEmployeeByShopId = async (req, res) => {
	try {
		const id = req.params.shopid;
		const pipelint = [
			{
				$match: {
					shop_id: id
				}
			}
		];
		const user = await Users.aggregate(pipelint);
		if (!user)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getCustomer = async (req, res) => {
	try {
		const pipelint = [
			{
				$match: {
					position: 'customer'
				}
			}
		];
		const user = await Users.aggregate(pipelint);
		if (!user)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: user });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};