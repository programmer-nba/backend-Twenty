const bcrypt = require("bcrypt");
const { Shops, validate } = require("../../models/shop/shop.model");
const { Users } = require("../../models/user.model");

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			// fs.unlinkSync(req.file.path);
			return res
				.status(400)
				.send({ message: error.details[0].message, status: false });
		} else {
			const customer = await Users.findOne({ _id: req.body.shop_customer_id });
			if (customer.username !== 'customer') {
				return res
					.status(401)
					.send({ status: false, message: 'ผู้ใช้งานดังกล่าวไม่สามารถเพิ่มร้านค้าได้' });
			}
			const shop_number = await GenerateNumber(req.body.shop_type);
			const data = {
				...req.body,
				shop_number: shop_number,
			};
			const new_shop = new Shops(data);
			if (!new_shop) {
				return res
					.status(402)
					.send({ status: false, message: 'เพิ่มข้อมูลร้านค้าไม่สำเร็จ' });
			} else {
				new_shop.save();
				return res
					.status(200)
					.send({ status: true, message: 'สร้างร้านค้าสำเร็จ' });
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getShopAll = async (req, res) => {
	try {
		const shop = await Shops.find();
		if (!shop) {
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		} else {
			return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: shop });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getShopById = async (req, res) => {
	try {
		const id = req.params.id;
		const shop = await Shops.findOne({ _id: id });
		if (!shop) {
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		} else {
			return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: shop });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.getShopByCusId = async (req, res) => {
	try {
		const id = req.params.cusid;
		const pipelint = [
			{
				$match: { shop_customer_id: id },
			},
		];
		const shop = await Shops.aggregate(pipelint);
		if (!shop) {
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		} else {
			return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: shop });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.updateShop = async (req, res) => {
	try {
		const id = req.params.id;
		Shops.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
			} else {
				return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ', data: data })
			}
		}).catch((err) => {
			return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
		})

	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

module.exports.deleteShop = async (req, res) => {
	try {
		const id = req.params.id;
		Shops.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: "ลบข้อมูลร้านค้าไม่สำเร็จ" })
			} else {
				return res.status(203).send({ status: true, message: 'ลบข้อมูลร้านค้าสำเร็จ' })
			}
		}).catch((err) => {
			return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
	}
};

async function GenerateNumber(shop_type) {
	const pipelint = [
		{
			$group: { _id: 0, count: { $sum: 1 } },
		},
	];
	const count = await Shops.aggregate(pipelint);
	const countValue = count.length > 0 ? count[0].count + 1 : 1;
	const data = `TW${countValue.toString().padStart(4, "0")}`;
	return data;
};