const dayjs = require("dayjs");
const { BoxExpress } = require("../../../models/tossagun/express/box.express.model");
const { BoxOrders } = require("../../../models/tossagun/express/box.order.model");

module.exports.create = async (req, res) => {
	try {
		const box = await BoxExpress.findOne({ name: req.body.name });
		if (box)
			return res.status(409).send({
				status: false,
				message: "กล่องพัสดุนี้มีในระบบแล้ว",
			});
		const new_box = new BoxExpress(req.body);
		if (!new_box)
			return res.status(403).send({
				status: false,
				message: "มีบางอย่างผิดพลาด",
			});
		new_box.save();
		return res.status(201).send({ status: true, message: 'เพิ่มกล่องพัสดุสำเร็จ', data: new_box })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBoxAll = async (req, res) => {
	try {
		const box = await BoxExpress.find();
		if (!box)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: box });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBoxById = async (req, res) => {
	try {
		const box = await BoxExpress.findOne({ _id: req.params.id });
		if (!box)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: box });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBoxByShop = async (req, res) => {
	try {
		const shopid = req.params.shopid;
		const pipelint = [
			{
				$match: { shop_id: shopid },
			}
		];
		const box = await BoxExpress.aggregate(pipelint);
		if (box) {
			return res.status(200).send({ status: true, message: 'ดึงข้อมูลรายการสินค้าสำเร็จ', data: box })
		} else {
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลรายการสินค้าไม่สำเร็จ' });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.updateBox = async (req, res) => {
	try {
		const id = req.params.id;
		await BoxExpress.findByIdAndUpdate(id, {
			...req.body
		}, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(403).send({
					message: "แก้ไขรายการกล่องพัสดุดังกล่าวไม่สำเร็จ",
					status: true,
				});
			} else {
				return res.status(200).send({
					message: "แก้ไขรายการกล่องพัสดุสำเร็จ",
					status: true,
				});
			}
		}).catch((err) => {
			return res.status(500).send({ message: "ไม่สามารถแก้ไขรายงานนี้ได้", status: false, });
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.delete = async (req, res) => {
	try {
		const id = req.params.id;
		await BoxExpress.findByIdAndDelete(id, {
			useFindAndModify: false
		}).then((data) => {
			if (!data) {
				return res.status(403).send({
					message: "ลบรายการกล่องพัสดุดังกล่าวไม่สำเร็จ",
					status: true,
				});
			} else {
				return res.status(200).send({
					message: "ลบรายการกล่องพัสดุสำเร็จ",
					status: true,
				});
			}
		}).catch((err) => {
			return res.status(500).send({ message: "ไม่สามารถลบรายงานนี้ได้", status: false, });
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.createOrder = async (req, res) => {
	try {
		const new_order = new BoxOrders({
			...req.body,
			timestamp: dayjs(Date.now()).format(""),
		});
		if (!new_order)
			return res.status(403).send({
				status: false,
				message: "มีบางอย่างผิดพลาด",
			});
		new_order.save();
		return res.status(201).send({ status: true, message: 'เพิ่มรายงานสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getBoxOrderShop = async (req, res) => {
	try {
		const shopid = req.params.shopid;
		const pipelint = [
			{
				$match: { shop_id: shopid },
			}
		];
		const box = await BoxOrders.aggregate(pipelint);
		if (box) {
			return res.status(200).send({ status: true, message: 'ดึงข้อมูลรายการขายสำเร็จ', data: box })
		} else {
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลรายการขายไม่สำเร็จ' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};