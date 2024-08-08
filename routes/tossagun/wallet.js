const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {
	try {
		await axios.post(`${process.env.TOSSAGUN_API}/customer/wallet`, null, {
			headers: {
				'auth-token': `Bearer ${process.env.TOSSAGUN_TOKEN}`
			}
		}).then((response) => {
			return res.status(200).send({ status: true, message: 'ยอดเงินคงเหลือ', wallet: response.data.wallet })
		}).catch((err) => {
			console.log('error : ', err);
		});
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
});

module.exports = router;