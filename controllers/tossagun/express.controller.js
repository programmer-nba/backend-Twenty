const axios = require("axios");
const { PercentCourier } = require("../../models/tossagun/express/percent.express.model");
const { insuredExpress } = require("../../models/tossagun/express/insured.model.js");
const { Shops } = require("../../models/shop/shop.model");

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