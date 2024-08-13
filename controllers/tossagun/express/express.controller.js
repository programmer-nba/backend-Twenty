const axios = require("axios");
const dayjs = require("dayjs");
const { PercentCourier } = require("../../../models/tossagun/express/percent.express.model.js");
const { insuredExpress } = require("../../../models/tossagun/express/insured.model.js");
const { Shops } = require("../../../models/shop/shop.model.js");
const { OrderExpress } = require("../../../models/tossagun/express/order.express.model.js");
const { TossagunBookings } = require("../../../models/tossagun/express/tossagun.order.model.js");
const { WalletHistorys } = require("../../../models/shop/wallet.history.model.js");

module.exports.getPriceList = async (req, res) => {
	try {
		// console.log(req.body)
		const data = {
			...req.body,
			parcel: {
				height: Number(req.body.parcel.height),
				length: Number(req.body.parcel.length),
				weight: Number(req.body.parcel.weight),
				width: Number(req.body.parcel.width)
			},
		};

		const percent = await PercentCourier.find();

		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_express/price`, data, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});

		const findinsured = await insuredExpress.findOne({ express: "SHIPPOP" })
		let insuranceFee = 0
		if (findinsured) {
			// console.log(findinsured.product_value)
			let product_value = findinsured.product_value
			for (let i = 0; i < product_value.length; i++) {
				if (declared_value >= product_value[i].valueStart && declared_value <= product_value[i].valueEnd) {
					insuranceFee = product_value[i].insurance_fee
					break;
				}
			}
		}

		const obj = resp.data.data;
		const new_data = [];

		const findShop = await Shops.findOne({ _id: req.body.shop_id });
		if (!findShop) {
			return res
				.status(404)
				.send({ status: false, message: "ไม่สามารถค้นหาร้านเจอที่ท่านระบุได้" })
		}

		for (const ob of Object.keys(obj)) {
			if (obj[ob].available) {
				if (req.body.cod_amount > 0 && obj[ob].courier_code == 'ECP') {
					console.log('Encountered "ECP". Skipping this iteration.');
					continue; // ข้ามไปยังรอบถัดไป
				}
				let v = null;
				let p = percent.find(element => element.courier_code == obj[ob].courier_code);
				if (!p) {
					console.log(`ยังไม่มี courier name: ${obj[ob].courier_code}`);
				}
				// คำนวนต้นทุนของร้านค้า
				let cost = Number(obj[ob].price);
				let price = Math.ceil(cost + p.profit);
				let profit = price - cost;

				v = {
					...obj[ob],
					price_remote_area: 0,
					cost: cost,
					profit: profit,
					cod_amount: Number(req.body.cod_amount.toFixed()),
					fee_cod: 0,
					price: Number(price.toFixed()),
					declared_value: req.body.declared_value,
					insuranceFee: insuranceFee,
					total: 0,
					status: null
				};

				let total = 0;
				if (obj[ob].hasOwnProperty("price_remote_area")) { //เช็คว่ามี ราคา พื้นที่ห่างไกลหรือเปล่า
					total += obj[ob].price_remote_area + insuranceFee
					v.price_remote_area = obj[ob].price_remote_area
				} else {
					total += insuranceFee
				}

				if (req.body.cod_amount !== 0) {
					let vat3per = Number(req.body.cod_amount) * (3 / 100);
					let vat7per = Number(vat3per.toFixed(2)) * (7 / 100);
					let vatCOD = Number(vat3per.toFixed(2)) + Number(vat7per.toFixed(2));
					v.price_cod = Number(vat3per.toFixed(2));
					v.price_cod_vat = Number(vat7per.toFixed(2));
					total += Number(vatCOD.toFixed(2));
				}

				v.total = price + total;
				if (findShop.shop_wallet < v.total) {
					v.status = "เงินในกระเป๋าของท่านไม่เพียงพอ"
				} else {
					v.status = "พร้อมใช้งาน"
				}
				new_data.push(v);

			} else {
				console.log(`Skipping ${obj[ob].courier_code} because available is false`);
			}
		}
		return res.status(200).send({ status: true, origin_data: req.body, new: new_data });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.booking = async (req, res) => {
	try {
		const invoice = await invoiceNumber();

		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_express/booking`, req.body.product_detail, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});

		if (!resp.data.status) {
			return res.status(400).send({ status: false, message: resp.data.data[0] });
		}

		const obj = resp.data.data.data;
		const new_data = [];
		// console.log(resp)
		let cost = 0;
		let cost_tg = 0;
		let total = 0;
		let cod = 0;
		let cod_charge = 0;
		let cod_vat = 0;

		Object.keys(obj).forEach(async (ob) => {
			const percel = req.body.product_detail[ob];
			const v = {
				...obj[ob],
				...percel,
				invoice: invoice,
				purchase_id: String(resp.data.data.purchase_id),
				shop_id: req.body.shop_id,
				timestamp: dayjs(Date.now()).format(),
			};
			new_data.push(v);
			cost += percel.cost;
			cost_tg += percel.cost_tg;
			total += percel.total;
			cod += percel.cod_amount;
			cod_charge += percel.price_cod;
			cod_vat += percel.price_cod_vat;
		});

		const o = {
			shop_id: req.body.shop_id,
			purchase_id: String(resp.data.data.purchase_id),
			invoice: invoice,
			total: Number(total.toFixed(2)),
			total_cost_tg: Number(cost_tg.toFixed(2)),
			total_cost: Number(total.toFixed(2)),
			total_cod: Number(cod.toFixed(2)),
			total_cod_charge: Number(cod_charge.toFixed(2)),
			total_cod_vat: Number(cod_vat.toFixed(2)),
			// purchase_id: String(resp.data.purchase_id),
			product: new_data,
			status: [
				{ name: "ชำระเงิน", timestamp: dayjs(Date.now()).format() }
			],
			timestamp: dayjs(Date.now()).format(),
		};

		const createOrder = await OrderExpress.create(o);
		const createOrderTossagun = await TossagunBookings.insertMany(new_data);

		if (!createOrder && !createOrderTossagun) {
			console.log("ไม่สามารถสร้างข้อมูล booking ได้")
		}

		const shop = await Shops.findOne({ _id: req.body.shop_id });
		const wallet = shop.shop_wallet - total;
		const findShop = await Shops.findByIdAndUpdate(req.body.shop_id, { shop_wallet: wallet }, { useFindAndModify: false });
		if (!findShop) {
			return res.status(404).send({ status: false, message: "ไม่สามารถค้นหาร้านที่ท่านระบุได้" })
		}

		let doto = {
			shop_id: shop._id,
			orderid: createOrder._id,
			name: `รายการขนส่งหมายเลขที่ ${invoice}`,
			type: `เงินออก`,
			amount: total,
			before: shop.shop_wallet,
			after: shop.shop_wallet - total,
			timestamp: dayjs(Date.now()).format(""),
		};

		const record = await WalletHistorys.create(doto)
		if (!record) {
			return res.status(400).send({ status: false, message: "ไม่สามารถสร้างประวัติเงินออกได้" })
		}

		return res.status(200).send({ status: true, data: o, record: record, shop: findShop.shop_wallet, invoice: invoice })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

async function invoiceNumber() {
	data = `TE`
	let random = Math.floor(Math.random() * 100000000000)
	const combinedData = data + random;
	const findInvoice = await TossagunBookings.find({ invoice: combinedData })
	while (findInvoice && findInvoice.length > 0) {
		// สุ่ม random ใหม่
		random = Math.floor(Math.random() * 100000000000);
		combinedData = data + random;
		เช็คใหม่
		findInvoice = await TossagunBookings.find({ invoice: combinedData });
	}
	console.log(combinedData);
	return combinedData;
};

module.exports.labelHtml = async (req, res) => {
	try {

		const data = {
			purchase_id: req.body.purchase_id
		};

		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_express/label`, data, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});
		return res.status(200).send(resp.data);
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};

module.exports.getBookingAll = async (req, res) => {
	try {
		const booking = await OrderExpress.find();
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
		const booking = await OrderExpress.findOne({ _id: id });
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
		const booking = await OrderExpress.aggregate(pipelint);
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