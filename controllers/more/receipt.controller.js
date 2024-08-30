const { Receipts, validate } = require("../../models/more/receipt.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const uploadFolder = path.join(__dirname, '../../assets/receipt');
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadFolder)
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message, status: false });
		}
		const receipt = await Receipts.findOne({ receipt_name: req.body.receipt_name });
		if (receipt) {
			return res.status(405).send({ status: false, message: "มีชื่อใบเสร็จดังกล่าวในระบบแล้ว" });
		} else {
			const code = await generatePassword(6);
			console.log(code)
			const new_receipt = new Receipts({
				...req.body,
				receipte_code: code,
			});
			if (!new_receipt) {
				return res.status(405).send({ status: false, message: "มีบางอย่างผิดพลาด" });
			} else {
				new_receipt.save();
				return res.status(200).send({ status: true, message: "สร้างใบเสร็จรับเงินสำเร็จ", data: new_receipt });
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getReceiptAll = async (req, res) => {
	try {
		const receipt = await Receipts.find();
		if (!receipt) {
			return res.status(405).send({ status: false, message: "มีบางอย่างผิดพลาด" })
		} else {
			return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: receipt });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getReceiptById = async (req, res) => {
	try {
		const id = req.params.id;
		const receipt = await Receipts.findOne({ _id: id });
		if (!receipt) {
			return res.status(405).send({ status: false, message: "มีบางอย่างผิดพลาด" })
		} else {
			return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: receipt });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getReceiptByCode = async (req, res) => {
	try {
		const code = req.params.code;
		const receipt = await Receipts.findOne({ receipte_code: code });
		if (!receipt) {
			return res.status(405).send({ status: false, message: "มีบางอย่างผิดพลาด" })
		} else {
			return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: receipt });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		Receipts.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
			if (!data)
				return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
			return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
		}).catch((err) => {
			console.log(err);
			return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.uploadImage = async (req, res) => {
	try {
		const id = req.params.id;
		const receipt = await Receipts.findOne({ _id: id });
		if (!receipt)
			return res.status(405).send({ status: false, message: "ไม่พบข้อมูลดังกล่าว" });

		let upload = multer({ storage: storage }).single("image_receipt");
		upload(req, res, async function (err) {
			console.log(req.file);
			if (!req.file) {
				return res.status(405).send({ status: false, message: "กรุณาแนบรูปภาพ" });
			} else {
				Receipts.findByIdAndUpdate(id, { receipt_image: req.file.filename }, { useFindAndModify: false }).then((data) => {
					if (!data)
						return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
					return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
				}).catch((err) => {
					console.log(err);
					return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
				})
			}
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

function generatePassword(length) {
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let password = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		password += charset[randomIndex];
	}
	return password;
};

module.exports.getImage = async (req, res) => {
	try {
		const imgname = req.params.imgname;
		const imagePath = path.join(__dirname, '../../assets/receipt', imgname);
		// return res.send(`<img src=${imagePath}>`);
		return res.sendFile(imagePath);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};