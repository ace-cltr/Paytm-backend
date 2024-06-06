import { Router } from "express";
import { handleTransaction } from "../controllers/accountController.js";

const router = Router();


router.post("/account", handleTransaction);

export { router };
