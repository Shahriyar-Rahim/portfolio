import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../configs/mailer.config.js";

const pendingLinks = new Map();
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

const sendRecoveryEmail = async ({ email, link }) => {
  const title = "Reset your portfolio password";

  return sendEmail({
    from: `"Portfolio Admin" <${process.env.SMTP_USER || "admin@portfolio.local"}>`,
    to: email,
    subject: title,
    text: `Open this link to choose a new password: ${link}`,
    html: `<div style="font-family:Arial,sans-serif;padding:24px"><h2>${title}</h2><p>Use the secure link below to choose a new password. It expires in 15 minutes.</p><p><a href="${link}">Reset password</a></p></div>`,
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
    // Keep the response generic so this endpoint cannot be used to discover
    // which email addresses have an admin account.
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const key = email.toLowerCase();
      pendingLinks.set(key, {
        token,
        expiresAt: Date.now() + MAGIC_LINK_TTL_MS,
      });
      const params = new URLSearchParams({ email: key, token });
      const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?${params}`;
      const sent = await sendRecoveryEmail({ email: key, link });
      if (!sent.success) throw new Error("Unable to send reset email");
    }

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

export const resetPasswordWithMagicLink = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ success: false, message: "Email, reset link and new password are required" });
    }
    const key = email.toLowerCase();
    const entry = pendingLinks.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
      pendingLinks.delete(key);
      return res
        .status(400)
        .json({ success: false, message: "This reset link has expired. Request a new one." });
    }

    if (entry.token !== token) {
      return res
        .status(400)
        .json({ success: false, message: "This reset link is invalid" });
    }

    const user = await User.findOne({ email: key });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    user.password = password;
    await user.save();

    pendingLinks.delete(key);

    res.status(200).json({ success: true, message: "Password changed successfully. You can now sign in." });
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

export default { requestRecovery, resetPasswordWithMagicLink };
