import authConfig from "../configs/auth.config.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      // store token in cookies
      res.cookie("user-token", token);
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

const userControlers = {
  register,
  login,
};

export default userControlers;
