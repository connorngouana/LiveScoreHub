import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import { connectMongoDB } from "./lib/mongo.js";
import authRouter from "./routes/auth.js";
import tableRouter from "./routes/table.js";
import fixtureRouter from "./routes/fixtures.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();
app.use(cookieParser());

app.use(cors({
  credentials:true,
  origin:['http://localhost:3000']
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello this is the CeeScores server");
});

app.use("/auth", authRouter);
app.use("/table", tableRouter);
app.use("/fixtures", fixtureRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
