const { PercentTopups } = require("../../../models/tossagun/topup/percent.model");

module.exports.createPercent = async (req, res) => {
	try {
		const cheack_percent = await PercentTopups.findOne({ topup_id: req.body.topup_id });
		if (cheack_percent) {
			return res.status(400).send({ status: false, message: "รหัสเปอร์เซนต์ดังกล่าวมียุในระบบแล้ว" });
		} else {
			const new_percent = new PercentTopups({
				...req.body,
			});
			if (!new_percent) {
				return res.status(401).send({ status: false, message: "เพิ่มข้อมูลไม่สำเร็จ กรุณาทำรายอีกครั้ง" });
			} else {
				return res.status(200).send({ status: true, message: 'เพิ่มข้อมูลสำเร็จ', data: new_percent });
			}
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getPercentTopup = async (req, res) => {
	try {
		const percent = await PercentTopups.find();
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
		const percent = await PercentTopups.findOne({ _id: id });
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
		await PercentTopups.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
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
		await PercentTopups.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
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