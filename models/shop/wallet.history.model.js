const mongoose = require("mongoose");
const Joi = require("joi");

const WalletHistorySchema = new mongoose.Schema({
	shop_id: { type: String, default: "", required: false },
	orderid: { type: String, default: "", required: false },
	name: { type: String, required: true },
	type: { type: String, enum: ['เงินเข้า', 'เงินออก'], required: true },
	vat: { type: Number, required: false, default: 0 },
	total: { type: Number, required: false, default: 0 },
	amount: { type: Number, required: true },
	before: { type: Number, required: true },
	after: { type: Number, required: true },
	timestamp: { type: Date, required: false, default: Date.now() }
});

const WalletHistorys = mongoose.model("wallet_history", WalletHistorySchema);

module.exports = { WalletHistorys }