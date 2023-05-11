const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/UserModel.js");

dotenv.config();

async function authMiddleware(req, res, next) {
	try {
		const token = req.get("authorization");
		if (token) {
			const user = jwt.verify(token, process.env.SECRET);
			const userDoc = await UserModel.findOne({ email: user.email });
			if (userDoc) {
				const areSame = await bcrypt.compare(user.password, userDoc.password);
				if (areSame) {
					req.userDoc = userDoc;
					next();
				} else {
					res.status(400).send({
						message: "wrong password"
					});
				}
			} else {
				res.status(404).send({
					message: "user not found"
				});
			}
		} else {
			res.status(404).send({
				message: "token required"
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
}

module.exports = authMiddleware;
