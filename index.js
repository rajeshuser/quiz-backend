const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connection } = require("./database");
const usersRouter = require("./routers/usersRouter");
const quizsRouter = require("./routers/quizsRouter");
const leaderboardsRouter = require("./routers/leaderboardsRouter");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/quizs", quizsRouter);
app.use("/leaderboards", leaderboardsRouter);

app.get("/", (req, res) => {
	res.status(200).send({
		message: "home"
	});
});

connectTheListen();

async function connectTheListen() {
	try {
		await connection;
		console.log("app is connected to database");
		app.listen(process.env.PORT, () => {
			console.log("app is listening at", `http://localhost:${process.env.PORT}`);
		});
	} catch (error) {
		console.log({ error: error.message });
	}
}
