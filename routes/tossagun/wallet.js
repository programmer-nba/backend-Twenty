const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {
	try {
		// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		const value = {
			auth_token: process.env.TOSSAGUN_TOKEN
		};
		const resp = await axios.post(`${process.env.TOSSAGUN_API}/customer/wallet`, value, {
			headers: {
				"Accept-Encoding": "gzip,deflate,compress",
			}
		});
		console.log(resp.data)
		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'ยอดเงินคงเหลือ', wallet: resp.data.wallet })
		} else {
			return res.status(403).send({ status: false, message: resp.response.data.message });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
});

module.exports = router;