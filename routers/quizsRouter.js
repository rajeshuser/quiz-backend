const express = require("express");
const QuizModel = require("../models/QuizModel");
const authMiddleware = require("../middlewares/authMiddleware");

const quizsRouter = express.Router();

quizsRouter.get("/", async (req, res) => {
	try {
		const quizs = await QuizModel.find({});
		res.status(200).send(quizs);
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

quizsRouter.post("/", authMiddleware, async (req, res) => {
	try {
		const quiz = req.body;
		const quizDoc = new QuizModel(quiz);
		await quizDoc.save();
		res.status(201).send({
			message: "quiz is created"
		});
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

quizsRouter.patch("/:_id", authMiddleware, async (req, res) => {
	try {
		const userDoc = req.userDoc;
		const { _id } = req.params;
		const update = req.body;
		const quizDoc = await QuizModel.findOne({ _id });
		if (userDoc.email === quizDoc.creator) {
			const quiz = await QuizModel.findOneAndUpdate({ _id }, update);
			await QuizModel.findOneAndUpdate({ _id }, update);
			res.status(201).send({
				message: "quiz is updated"
			});
		} else {
			res.status(400).send({
				message: "you are not creator of quiz",
				email: userDoc.email,
				creator: quizDoc.creator
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

quizsRouter.delete("/:_id", authMiddleware, async (req, res) => {
	try {
		const { _id } = req.params;
		await QuizModel.findOneAndDelete({ _id });
		res.status(201).send({
			message: "quiz is deleted"
		});
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

module.exports = quizsRouter;
