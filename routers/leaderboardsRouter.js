const express = require("express");
const LeaderboardModel = require("../models/LeaderboardModel");

const leaderboardRouter = express.Router();

leaderboardRouter.get("/", async (req, res) => {
	try {
		const leaderboards = await LeaderboardModel.find({});
		res.status(200).send(leaderboards);
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

leaderboardRouter.post("/", async (req, res) => {
	try {
		const leaderboard = req.body;
		const leaderboardDoc = new LeaderboardModel(leaderboard);
		await leaderboardDoc.save();
		res.status(201).send({
			message: "leaderboard is created"
		});
	} catch (error) {
		res.status(500).send({
			error: error.message
		});
	}
});

module.exports = leaderboardRouter;
