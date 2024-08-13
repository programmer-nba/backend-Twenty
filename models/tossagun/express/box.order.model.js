const mongoose = require("mongoose");
const Joi = require("joi");

const BoxOrderSchema = new mongoose.Schema({
	shop_id: { type: String, required: true },
	invoice: { type: String, required: false, default: "ไม่มี" },
	product: { type: Array, default: [] },
	total: { type: Number, required: false },
	timestamp: { type: String, required: true },
})

const BoxOrders = mongoose.model("box_order", BoxOrderSchema);

module.exports = { BoxOrders };