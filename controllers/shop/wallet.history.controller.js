const { WalletHistorys } = require("../../models/shop/wallet.history.model");

module.exports.create = async (req, res) => {
	try {
		const history_wallet = new WalletHistorys({
			...req.body
		});
		if (!history_wallet) {
			return res.status(403).send({ status: false, message: "สร้างประวัติการเงินไม่สำเร็จ" });
		} else {
			history_wallet.save();
			return res.status(200).send({ status: true, message: "สร้างประวัติการเงินสำเร็จ" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getWalletHistory = async (req, res) => {
	try {
		const history = await WalletHistorys.find();
		if (!history)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: history });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getWalletHistoryById = async (req, res) => {
	try {
		const id = req.params.id;
		const history = await WalletHistorys.findOne({ _id: id });
		if (!history)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: history });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getWalletHistoryByShop = async (req, res) => {
	try {
		const id = req.params.shopid;
		const pipelint = [
			{
				$match: { shop_id: id },
			},
		];
		const history = await WalletHistorys.aggregate(pipelint);
		if (!history)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: history });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};