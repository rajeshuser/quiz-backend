const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/UserModel");

dotenv.config();

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
	try {
		const users = await UserModel.find({});
		res.status(200).send(users);
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

usersRouter.post("/signup", async (req, res) => {
	try {
		const user = req.body;
		user.password = await bcrypt.hash(user.password, 3);
		const userDoc = new UserModel(user);
		await userDoc.save();
		res.status(201).send({
			message: "signup successful"
		});
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

usersRouter.post("/signin", async (req, res) => {
	try {
		const token = req.get("authorization");
		if (token) {
			const user = jwt.verify(token, process.env.SECRET);
			const userDoc = await UserModel.findOne({ email: user.email });
			if (userDoc) {
				const areSame = await bcrypt.compare(user.password, userDoc.password);
				if (areSame) {
					res.status(201).send({
						message: "signin successful"
					});
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
			const user = req.body;
			const userDoc = await UserModel.findOne({ email: user.email });
			if (userDoc) {
				const areSame = await bcrypt.compare(user.password, userDoc.password);
				if (areSame) {
					const token = jwt.sign(user, process.env.SECRET);
					res.status(201).send({
						message: "signin successful",
						token
					});
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
		}
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

module.exports = usersRouter;
