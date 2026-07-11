import authConfig from "../configs/auth.config.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    // This backend has a single owner/admin (no separate roles), so the
    // register endpoint must never be left open in production — anyone who
    // could hit it would gain full admin access. Gate it behind a one-time
    // setup key from the environment.
    if (!process.env.SETUP_KEY || setupKey !== process.env.SETUP_KEY) {
      return res.status(403).json({
        success: false,
        message: "Registration is disabled",
      });
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // get email and pass from request body
    const { email, password } = req.body;
    // find if the user is exists in the database usig email
    const user = await User.findOne({ email }).select("+password");
    // user is not in db --> throw error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // user in db --> check password
    const isMatched = await bcrypt.compare(password, user.password);
    // password is not correct --> throw error
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    } else {
      // password is correct --> generate token (jwt)
      const token = authConfig.encodeToken(user?.email, user?._id?.toString());
      // store token in an httpOnly cookie so it can't be read/exfiltrated via JS
      res.cookie("user-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        domain: ".no-idea.top",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // return response to the frontend
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          id: user._id,
          email: user.email,
        },
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("user-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    domain: ".no-idea.top",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const me = async (req, res) => {
  // req.user is attached by the protect middleware
  res.status(200).json({
    success: true,
    data: { id: req.user._id, email: req.user.email },
  });
};

const updateAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Account updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const userControlers = {
  register,
  login,
  logout,
  me,
  updateAccount,
};

export default userControlers;
