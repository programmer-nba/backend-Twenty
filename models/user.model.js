const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
	min: 6,
	max: 30,
	lowerCase: 0,
	upperCase: 0,
	numeric: 0,
	symbol: 0,
	requirementCount: 2,
};

const UserSchema = new mongoose.Schema({
	shop_id: { type: String, required: false, default: "" },
	prefix: { type: String, required: true },
	fristname: { type: String, required: true },
	lastname: { type: String, required: true },
	iden: { type: String, required: false, default: "" },
	phone: { type: String, required: true },
	email: { type: String, required: false, default: "" },
	username: { type: String, required: true },
	password: { type: String, required: true },
	address: { type: String, required: false, default: "" },
	subdistrict: { type: String, required: false, default: "" },
	district: { type: String, required: false, default: "" },
	province: { type: String, required: false, default: "" },
	postcode: { type: String, required: false, default: "" },
	position: {
		type: String, enum: ["admin", "employee", "customer"],
		required: true,
	},
	status: { type: Boolean, require: false, default: true },
});

UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ id: this._id, name: this.fristname, row: this.position },
		process.env.JWTPRIVATEKEY,
		{
			expiresIn: "8h",
		}
	);
	return token;
};

const Users = mongoose.model("user", UserSchema);

const validate = (data) => {
	const schema = Joi.object({
		shop_id: Joi.string().default(""),
		prefix: Joi.string().required().label("กรอกคำนำหน้า"),
		fristname: Joi.string().required().label("กรอกชื่อ"),
		lastname: Joi.string().required().label("กรอกนามสกุล"),
		iden: Joi.string().default(""),
		phone: Joi.string().required().label("กรอกเบอร์โทรศัพท์"),
		email: Joi.string().default(""),
		address: Joi.string().default(""),
		subdistrict: Joi.string().default(""),
		district: Joi.string().default(""),
		province: Joi.string().default(""),
		postcode: Joi.string().default(""),
		username: Joi.string().required().label("กรอกไอดีผู้ใช้"),
		password: passwordComplexity(complexityOptions).required().label("กรอกรหัสผ่าน"),
		position: Joi.string().required().label("กรอกระดับผู้ใช้"),
	});
	return schema.validate(data);
};

module.exports = { Users, validate };