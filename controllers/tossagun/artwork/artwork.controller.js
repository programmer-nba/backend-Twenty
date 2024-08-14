const axios = require("axios");
const dayjs = require("dayjs");

module.exports.getProductAll = async (req, res) => {
	try {

		const resp = await axios.post(`${process.env.TOSSAGUN_API}/api/api_service/artwork`, null, {
			headers: {
				// "Accept-Encoding": "gzip,deflate,compress",
				"auth-token": process.env.TOSSAGUN_TOKEN
			}
		});

		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: resp.data.data })
		} else {
			return res.status(403).send({ status: false, message: 'มีบางอย่างผิดพลาด' });
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" })
	}
};