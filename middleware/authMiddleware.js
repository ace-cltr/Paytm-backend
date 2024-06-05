import { JWT_SECRET } from "../server.js";
import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  let tokenArr;
  if (authorization.startsWith("Bearer ")) {
    tokenArr = authorization.split(" ");
  } else {
    return res.status(411).json({ message: "access denied" });
  }

  const verified = jwt.verify(tokenArr[1], JWT_SECRET);
  if (verified) {
    next();
  } else {
    res.status(411).json({
      message: "access denied",
    });
  }
}

export { authMiddleware };
