const mongoose = require("mongoose");

const TGTBookingSchema = new mongoose.Schema({
	shop_id: { type: String, required: true },
	invoice: { type: String, required: false },
	ref_number: { type: Number, required: false },
	order_id: { type: String, required: false },
	mobile: { type: String, required: false },
	branch: { type: String, required: false },
	service_id: { type: Number, required: false },
	name: { type: String, required: false },
	type: { type: String, required: false },
	amount: { type: Number, required: false },
	order_status: { type: String, default: "", required: false },
	timestamp: { type: Date, required: true },
});

const TGTBookings = mongoose.model("topup_booking", TGTBookingSchema);

module.exports = { TGTBookings };