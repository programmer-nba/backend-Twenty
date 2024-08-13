const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const { Wallets, validate } = require("../../models/shop/wallet.model");

const uploadFolder = path.join(__dirname, '../../assets/wallet');
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
		let upload = multer({ storage: storage }).single("slip_image");
		upload(req, res, async function (err) {
			console.log(req.file)
			const { error } = validate(req.body);
			if (error) {
				fs.unlinkSync(req.file.path);
				return res
					.status(400)
					.send({ message: error.details[0].message, status: false });
			} else {
				if (req.file) {
					const invoice = await invoiceNumber();
					const new_wallet = new Wallets({
						...req.body,
						invoice: invoice,
						detail: req.file.filename,
						timestamp: dayjs(Date.now()).format(),
					});
					if (!new_wallet) {
						fs.unlinkSync(req.file.path);
						return res.status(405).send({ status: false, message: "มีบางอย่างผิดพลาด" })
					} else {
						new_wallet.save();
						return res.status(202).send({ status: true, message: 'แจ้เงติมเงินสำเร็จ' })
					}
				}
			}
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getWalletAll = async (req, res) => {
	try {
		const wallet = await Wallets.find();
		if (!wallet)
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: wallet });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getWalletById = async (req, res) => {
	try {
		const id = req.params.id;
		const wallet = await Wallets.findOne({ _id: id });
		if (!wallet)
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: wallet });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateWallet = async (req, res) => {
	try {
		const id = req.params.id;
		Wallets.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ status: false, message: "แก้ไขข้อมูลไม่สำเร็จ" })
			} else {
				return res.status(203).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
			}
		}).catch((err) => {
			console.log(err)
			return res.status(500).send({ status: false, message: 'มีบางอย่างผิดพลาด' + id })
		})
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getImage = async (req, res) => {
	try {
		const imgname = req.params.imgname;
		const imagePath = path.join(__dirname, '../../assets/wallet', imgname);
		// return res.send(`<img src=${imagePath}>`);
		return res.sendFile(imagePath);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

async function invoiceNumber() {
	data = `TSW`
	let random = Math.floor(Math.random() * 100000000000)
	const combinedData = data + random;
	const findInvoice = await Wallets.find({ invoice: combinedData })

	while (findInvoice && findInvoice.length > 0) {
		// สุ่ม random ใหม่
		random = Math.floor(Math.random() * 100000000000);
		combinedData = data + random;

		// เช็คใหม่
		findInvoice = await Wallets.find({ invoice: combinedData });
	}

	console.log(combinedData);
	return combinedData;
};