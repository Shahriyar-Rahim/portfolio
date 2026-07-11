import crypto from "crypto";
import User from "../models/user.model.js";
import authConfig from "../configs/auth.config.js";
import { sendMailSafe } from "../configs/mailer.config.js";

const pendingCodes = new Map();
const pendingLinks = new Map();

const createCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendRecoveryEmail = async ({ email, code, link }) => {
  const title = code ? "Admin recovery code" : "Admin magic link";
  const intro = code
    ? `Use the following code to verify your account and reset your password.`
    : `Use the following link to sign in securely without a password.`;
  const bodyLines = code
    ? [
        `Verification code: <strong>${code}</strong>`,
        "This code expires in 10 minutes.",
      ]
    : [`Magic link: <a href="${link}">${link}</a>`];

  return sendMailSafe({
    from: `"Portfolio Admin" <${process.env.SMTP_USER || "admin@portfolio.local"}>`,
    to: email,
    subject: title,
    text: code ? `Your recovery code is ${code}` : `Your magic link is ${link}`,
    html: `<div style="font-family:Arial,sans-serif;padding:24px"><h2>${title}</h2><p>${intro}</p>${bodyLines.map((line) => `<p>${line}</p>`).join("")}</div>`,
  });
};

export const requestRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found" });
    }

    const code = createCode();
    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?magic=${crypto.randomUUID()}`;

    pendingCodes.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    pendingLinks.set(email.toLowerCase(), {
      link,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    await sendRecoveryEmail({ email, code, link });

    res
      .status(200)
      .json({ success: true, message: "Recovery instructions sent" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Recovery request failed",
        error: error.message,
      });
  }
};

export const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const key = email.toLowerCase();
    const entry = pendingCodes.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
      pendingCodes.delete(key);
      return res
        .status(400)
        .json({ success: false, message: "Recovery code expired" });
    }

    if (entry.code !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recovery code" });
    }

    const user = await User.findOne({ email: key });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    if (password) {
      user.password = password;
      await user.save();
    }

    pendingCodes.delete(key);

    res.status(200).json({ success: true, message: "Recovery successful" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Recovery failed",
        error: error.message,
      });
  }
};

export const consumeMagicLink = async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Missing recovery token" });
    }

    const entry = pendingLinks.get(email.toLowerCase());
    if (!entry || entry.expiresAt < Date.now()) {
      pendingLinks.delete(email.toLowerCase());
      return res
        .status(400)
        .json({ success: false, message: "Magic link expired" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    pendingLinks.delete(email.toLowerCase());

    const tokenValue = authConfig.encodeToken(user.email, user._id.toString());
    res.cookie("user-token", tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/admin`,
    );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Magic link failed",
        error: error.message,
      });
  }
};

export default { requestRecovery, verifyRecoveryCode, consumeMagicLink };
