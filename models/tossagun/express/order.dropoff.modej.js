const mongoose = require("mongoose");

const DropOffSchema = new mongoose.Schema({
	shop_id: { type: String, required: true },
	purchase_id: { type: String, required: true },
	tracking_code: { type: String, required: false },
	courier_tracking_code: { type: String, required: false },
	invoice: { type: String, required: false },
	origin: { type: Object, required: false },
	from: { type: Object, required: false },
	to: { type: Object, required: false },
	parcel: { type: Object, required: false },
	courier_code: { type: String, required: false },
	timestamp: { type: Date, required: true }
});

const DropOffExpress = mongoose.model("dropoff_express", DropOffSchema);

module.exports = { DropOffExpress };