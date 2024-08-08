const { PercentCourier } = require("../../models/tossagun/express/percent.express.model");

module.exports.createPercent = async (req, res) => {
	try {

	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getPercentExpress = async (req, res) => {
	try {
		const percent = await PercentCourier.find();
		if (!percent)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" })
		return res.status(201).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: percent });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getPercentById = async (req, res) => {
	try {
		const id = req.params.id;
		const percent = await PercentCourier.findOne({ _id: id });
		if (!percent)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" })
		return res.status(201).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: percent });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.updatePercent = async (req, res) => {
	try {
		const id = req.params.id;
		await PercentCourier.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลดังกล่าวได้' })
			} else {
				return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
			}
		}).catch((err) => {
			return res.status(501).send({ status: false, message: 'มีบ่างอย่างผิดพลาด' })
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.deletePercent = async (req, res) => {
	try {
		const id = req.params.id;
		await PercentCourier.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: 'ไม่สามารถลบข้อมูลดังกล่าวได้' })
			} else {
				return res.status(200).send({ status: true, message: 'ลบข้อมูลดังกล่าวสำเร็จ' })
			}
		}).catch((err) => {
			return res.status(501).send({ status: false, message: 'มีบ่างอย่างผิดพลาด' })
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};