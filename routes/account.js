import { Router } from "express";

const router = Router();

router.get("/transferMoney", (req, res) => {
  res.end("hi");
});

export { router };
