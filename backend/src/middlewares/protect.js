import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect routes — only the authenticated site owner passes through.
// This is a single-owner portfolio backend (User === the portfolio admin),
// so there is no separate Admin model/role — we just verify the JWT and
// attach the matching user to req.user, which is what every controller expects.
const protect = async (req, res, next) => {
  let token;

  // Accept token either from the Authorization header or the httpOnly cookie
  // set on login ("user-token"), since the frontend uses the cookie by default.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies["user-token"]) {
    token = req.cookies["user-token"];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

const protectMiddleware = { protect };
export default protectMiddleware;