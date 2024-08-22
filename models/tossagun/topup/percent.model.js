const mongoose = require("mongoose");

const PercentTopupSchema = new mongoose.Schema({
	topup_id: { type: Number, required: false },
	topup_type: { type: String, required: false },
	topup_name: { type: String, required: false },
	cost: { type: Number, default: 0, required: false },
	percent: { type: Number, default: 0, required: false },
	on_off: { type: Boolean, default: true, required: false },
});

const PercentTopups = mongoose.model("percent_topup", PercentTopupSchema);

module.exports = { PercentTopups };