const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
	title: String,
	email: String,
	score: Number
});

const LeaderboardModel = mongoose.model("leaderboard", leaderboardSchema);

module.exports = LeaderboardModel;
