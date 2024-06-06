import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  handleQuery,
  signInUser,
  signupUser,
  updateUserInfo,
} from "../controllers/userController.js";

const router = Router();

router.post("/signup", asyncHandler(signupUser));

router.post("/signin", asyncHandler(signInUser));

router.put("/", authMiddleware, updateUserInfo);

// get all user route using query parameters (important)
router.get("/bulk", authMiddleware, asyncHandler(handleQuery));

export { router };
