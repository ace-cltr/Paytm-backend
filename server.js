import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { router as userRouter } from "./routes/user.js";
import { router as accountRouter } from "./routes/account.js";

const app = express();
app.use(express.json()); // body parser

app.use(cors()); // cors because FE and BE on diff. places

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * User Schema
 * @route user
 * @requires mongoose
 */
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", accountRouter);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));

export { JWT_SECRET };

// allow user to signIn
// allow user to login
// allow user to update their firstName, lastName, password

// create Db connection in db.js file and connect to database
// create a mongoose schema for user table
// and a model based on that schema

// api/v1/account/transferMoney
// api/v1/account/balance
