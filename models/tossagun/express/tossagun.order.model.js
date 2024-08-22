const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const TossagunSchema = new Schema({
	// employee_id: { type: String, required: false },
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
	price: { type: Number, required: false },
	insurance_code: { type: String, required: false },
	insuranceFee: { type: Number, required: false },
	declared_value: { type: Number, required: false },
	cod_amount: { type: Number, required: false },
	cod_charge: { type: Number, required: false },
	cod_vat: { type: Number, required: false },
	// cost_tg: { type: Number, required: true },
	cost: { type: Number, required: true },
	cost_shop: { type: Number, required: true },
	total: { type: Number, required: false },
	net: { type: Number, required: false },
	profit: { type: Number, required: false },
	profit_shop: { type: Number, required: false },
	// profit_cus: { type: Number, required: false },
	// total_platform: { type: Number, required: false },
	price_remote_area: { type: Number, required: false },
	// type_payment: { type: String, required: false },
	// tossagun_tel: { type: String, required: false },
	// bill_status: { type: String, default: "พักบิล", required: false },
	order_status: { type: String, default: "booking", required: false },
	package_detail: { type: Object, default: null, required: false }, // กรณีมีการเรียกเก็บเพิ่มเติม
	package_detail_status: { type: Boolean, default: false, required: false }, //สถานะการหักเงินของรpartner กรณีมีการหักส่วนต่าง
	timestamp: { type: Date, required: true }
}, { timestamps: true })

const TossagunBookings = mongoose.model("tossagun_booking", TossagunSchema);

module.exports = { TossagunBookings };