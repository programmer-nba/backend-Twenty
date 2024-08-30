const mongoose = require("mongoose");
const Joi = require("joi");

const ReceiptSchema = new mongoose.Schema({
	receipte_code: { type: String, required: false, default: "" },
	receipt_name: { type: String, required: true }, // ชื่อใบเสร็จ
	receipt_detail: { type: String, required: true }, // ส่วนหัวใบเสร็
	receipt_description: { type: String, required: true }, // ส่วนล่างใบเสร็จ
	receipt_image: { type: String, required: false, default: "" }, // โลโก้ ใบเสร็จ
});

const Receipts = mongoose.model("receipt", ReceiptSchema);

const validate = (data) => {
	const schema = Joi.object({
		receipte_code: Joi.string().default(""),
		receipt_name: Joi.string().required().label("กรอกชื่อใบเสร็จ"),
		receipt_detail: Joi.string().required().label("กรอกรายละเอียดส่วนหัว"),
		receipt_description: Joi.string().required().label("กรอกรายละเอียดส่วนท้าย"),
		receipt_image: Joi.string().default(""),
	});
	return schema.validate(data);
};

module.exports = { Receipts, validate };