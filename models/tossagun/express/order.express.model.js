const mongoose = require("mongoose");
const Joi = require("joi");

const OrderExpressSchema = new mongoose.Schema({
    shop_id: { type: String, required: true },
    invoice: { type: String, required: false, default: "ไม่มี" },
    invoice_full: { type: String, default: "ไม่มี" },
    total: { type: Number, required: false },
    total_cost: { type: Number, required: false, default: 0 },
    total_cod: { type: Number, required: false, default: 0 },
    total_cod_charge: { type: Number, required: false, default: 0 },
    total_cod_vat: { type: Number, required: false, default: 0 },
    purchase_id: { type: String, required: true, default: "ไม่มี" },
    product: { type: Array, default: [] },
    status: { type: Array, default: [] },
    timestamp: { type: String, required: true },
})

const OrderExpress = mongoose.model("order_express", OrderExpressSchema);

const validate = (data) => {
    const schema = Joi.object({
        shop_id: Joi.string().required().label("ไม่พบ shop_id"),
        invoice: Joi.string().default("ไม่มี"),
        invoice_full: Joi.string().default("ไม่มี"),
        total: Joi.number().required().label("ไม่พบยอดรวมใบเสร็จ"),
        total_cost: Joi.number().default(0),
        purchase_id: Joi.string().default("ไม่มี"),
        product: Joi.array(),
        status: Joi.array(),
        timestamp: Joi.string(),
    });
    return schema.validate(data);
}

module.exports = { OrderExpress, validate };