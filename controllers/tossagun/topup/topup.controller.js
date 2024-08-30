const axios = require("axios");
const dayjs = require("dayjs");
const { TGTBookings } = require("../../../models/tossagun/topup/topup.tossagun.order");
const { Shops } = require("../../../models/shop/shop.model");
const { OrderTopup } = require("../../../models/tossagun/topup/order.topup.model");
const { WalletHistorys } = require("../../../models/shop/wallet.history.model");

module.exports.bookingTopup = async (req, res) => {
	try {

		const shop = await Shops.findOne({ _id: req.body.shop_id });
		const amount = req.body.product_detail.reduce((sum, el) => sum + el.total, 0);
		if (shop.shop_wallet < amount) {
			return res.status(405).send({ status: false, message: 'ยอดเงินไม่เพียงพอต่อการทำรายการ' })
		}

		const invoice = await invoiceNumber();
		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_topup/booking`, req.body.product_detail, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});

		if (!resp.data.status) {
			return res.status(400).send({ status: false, message: resp.data.data[0] });
		}

		const obj = resp.data.data;
		const new_data = [];
		// console.log(obj)
		let total = 0;

		Object.keys(obj).forEach(async (ob) => {
			const topup = req.body.product_detail[ob];
			const v = {
				...obj[ob],
				...topup,
				invoice: invoice,
			};
			new_data.push(v);
			total += obj[ob].amount;
		});

		const o = {
			shop_id: req.body.shop_id,
			invoice: invoice,
			ref_number: resp.data.ref,
			total: Number(total.toFixed(2)),
			product: new_data,
			status: [
				{ name: "ชำระเงิน", timestamp: dayjs(Date.now()).format() }
			],
			timestamp: dayjs(Date.now()).format(),
		};

		const createOrder = await OrderTopup.create(o);
		const createOrderTG = await TGTBookings.insertMany(new_data);
		if (!createOrder && !createOrderTG) {
			console.log("ไม่สามารถสร้างข้อมูล booking ได้")
		}

		const wallet = shop.shop_wallet - total;
		await Shops.findByIdAndUpdate(req.body.shop_id, { shop_wallet: wallet }, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(405).send({ status: false, message: 'ตัดเงินจากกระเป๋าไม่สำเร็จ' })
			}
		});

		let doto = {
			shop_id: shop._id,
			orderid: createOrder._id,
			name: `รายการเติมเงินหมายเลขที่ ${invoice}`,
			type: `เงินออก`,
			amount: total,
			before: shop.shop_wallet,
			after: wallet,
			timestamp: dayjs(Date.now()).format(""),
		};

		const record = await WalletHistorys.create(doto)
		if (!record) {
			return res.status(400).send({ status: false, message: "ไม่สามารถสร้างประวัติเงินออกได้" })
		}

		return res.status(200).send({ status: true, data: o, invoice: invoice })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

async function invoiceNumber() {
	data = `TE`
	let random = Math.floor(Math.random() * 100000000000)
	const combinedData = data + random;
	const findInvoice = await TGTBookings.find({ invoice: combinedData })
	while (findInvoice && findInvoice.length > 0) {
		// สุ่ม random ใหม่
		random = Math.floor(Math.random() * 100000000000);
		combinedData = data + random;
		// เช็คใหม่
		findInvoice = await TGTBookings.find({ invoice: combinedData });
	}
	console.log(combinedData);
	return combinedData;
};

module.exports.getBookingAll = async (req, res) => {
	try {
		const booking = await TGTBookings.find();
		if (!booking)
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: booking });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBookingById = async (req, res) => {
	try {
		const id = req.params.id;
		const booking = await TGTBookings.findOne({ _id: id });
		if (!booking)
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: booking });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBookingByShop = async (req, res) => {
	try {
		const id = req.params.shopid;
		const pipelint = [
			{
				$match: { shop_id: id },
			},
		];
		const booking = await OrderTopup.aggregate(pipelint);
		if (!booking)
			return res.status(408).send({
				status: false,
				message: "ดึงข้อมูลไม่สำเร็จ!",
			});
		return res.status(201).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: booking });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};