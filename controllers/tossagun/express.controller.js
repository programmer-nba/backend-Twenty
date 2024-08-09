const axios = require("axios");
const { PercentCourier } = require("../../models/tossagun/express/percent.express.model");

module.exports.getPriceList = async (req, res) => {
	try {

		// const percent = await PercentCourier.find();

		// const weight = req.body.parcel.weight;
		// const declared_value = req.body.declared_value;
		// const cod_amount = req.body.cod_amount;

		// if (weight == 0) {
			// return res
				// .status(400)
				// .send({ status: false, message: "กรุณาระบุน้ำหนัก" })
		// }

		// if (!Number.isInteger(cod_amount) ||
			// !Number.isInteger(declared_value)) {
			// return res.status(400).send({
				// status: false,
				// message: `กรุณาระบุค่า COD หรือ มูลค่าสินค้า(ประกัน) เป็นจำนวนเต็มเท่านั้นห้ามใส่ทศนิยม`
			// });
		// }

		// let data = [];
		// data.push({
			// "from": {
				// "name": req.body.from.name,
				// "address": req.body.from.address,
				// "district": req.body.from.district,
				// "state": req.body.from.state,
				// "province": req.body.from.province,
				// "postcode": req.body.from.postcode,
				// "tel": req.body.from.tel
			// },
			// "origin": {
				// "name": req.body.origin.name,
				// "address": req.body.origin.address,
				// "district": req.body.origin.district,
				// "state": req.body.origin.state,
				// "province": req.body.origin.province,
				// "postcode": req.body.origin.postcode,
				// "tel": req.body.origin.tel
			// },
			// "to": {
				// "name": req.body.to.name,
				// "address": req.body.to.address,
				// "district": req.body.to.district,
				// "state": req.body.to.state,
				// "province": req.body.to.province,
				// "postcode": req.body.to.postcode,
				// "tel": req.body.to.tel
			// },
			// "parcel": {
				// "name": req.body.parcel.name,
				// "weight": req.body.parcel.weight,
				// "width": req.body.parcel.width,
				// "length": req.body.parcel.length,
				// "height": req.body.parcel.height
			// },
			// DHL FLE
			// "showall": 1,
			// cod_amount: req.body.cod_amount,
			// declared_value: req.body.declared_value,
		// });

		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_express/price`, req.body, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});

		const obj = resp.data.new;

		console.log(obj)

		return res.status(200).send({ status: true, origin_data: req.body, new: new_data });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};