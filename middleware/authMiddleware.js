import { JWT_SECRET } from "../server.js";
import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ message: "access denied" });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded._id) {
      req.body._id = decoded._id; // adding userId in req. object
      next();
    } else {
      res.status(403).json({
        message: "access denied",
      });
    }
  } catch (err) {
    res.status(403).json({
      message: "access denied",
    });
  }
}

export { authMiddleware };
