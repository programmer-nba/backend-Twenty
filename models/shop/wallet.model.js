const mongoose = require("mongoose");
const Joi = require("joi");

const WalletSchema = new mongoose.Schema({
	shop_id: { type: String, required: false, default: "" },
	invoice: { type: String, required: false }, // เลขที่ทำรายการ
	transaction: { type: String, required: false, default: "" },
	amount: { type: Number, require: true }, // จำนวนเงิน
	charge: { type: Number, required: false, default: 0 }, // ค่าธรรมเนียม
	detail: { type: String, required: false, default: "" },
	status: { type: String, required: false, default: 'รอตรวจสอบ' },
	remark: { type: String, required: false, default: '' },
	timestamp: { type: Date, required: false, default: Date.now() }, // วันที่ทำรายการ
});

const Wallets = mongoose.model("wallet", WalletSchema);

const validate = (data) => {
	const schema = Joi.object({
		shop_id: Joi.string().default(""),
		invoice: Joi.string(),
		amount: Joi.number().required().label('ไม่มียอดเติมเงิน'),
		charge: Joi.number().default(0),
		detail: Joi.string().default(""),
		status: Joi.string().label('รอตรวจสอบ'),
		remark: Joi.string().default(''),
	});
	return schema.validate(data);
};

module.exports = { Wallets, validate };