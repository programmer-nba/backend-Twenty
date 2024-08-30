const mongoose = require("mongoose");
const Joi = require("joi");

const OrderTopupSchema = new mongoose.Schema({
	shop_id: { type: String, required: true },
	invoice: { type: String, required: false, default: "" },
	ref_number: { type: Number, required: false },
	invoice_full: { type: String, default: "ไม่มี" },
	product: { type: Array, default: [] },
	total: { type: Number, required: false },
	status: { type: Array, default: [] },
	timestamp: { type: String, required: true },
});

const OrderTopup = mongoose.model("order_topup", OrderTopupSchema);

module.exports = { OrderTopup };