const axios = require("axios");
const dayjs = require("dayjs");
const { OrderTopupTossaguns } = require("../../../models/tossagun/topup/topup.tossagun.order");

module.exports.bookingTopup = async (req, res) => {
	try {
		// const invoice = await invoiceNumber();
		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_topup/booking`, req.body, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
				"auth-token": `Bearer ${process.env.TOSSAGUN_TOKEN}`
			},
		});

		console.log(resp)

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
