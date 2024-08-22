const mongoose = require("mongoose");
const Joi = require("joi");

const PercentCourierSchema = new mongoose.Schema({
	express: { type: String, required: false },
	courier_code: { type: String, required: false },
	courier_name: { type: String, required: false },
	profit: { type: Number, default: 0, required: false },
	profit_shop: { type: Number, default: 0, required: false },
	on_off: { type: Boolean, default: true, required: false },
})

const PercentCourier = mongoose.model("percent_courier", PercentCourierSchema);

module.exports = { PercentCourier };