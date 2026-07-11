import Inbox from "../models/inbox.model.js";
import {
  buildContactEmailHtml,
  buildReplyEmailHtml,
  buildThankYouEmailHtml,
  sendEmail,
} from "../configs/mailer.config.js";

const makeInbox = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if this email sent a message in the last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentMessage = await Inbox.findOne({
      email: email,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentMessage) {
      return res.status(429).json({
        success: false,
        message:
          "You have already sent a message recently. Please wait an hour.",
      });
    }

    const newInbox = await Inbox.create({
      name,
      email,
      subject,
      message,
    });

    const ownerEmail = process.env.SMTP_USER;
    const senderEmail = process.env.SMTP_USER;

    const ownerMail = await sendEmail({
      from: `"Portfolio Contact" <${senderEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `New Message: ${subject}`,
      text: `Message from ${name}:\n\n${message}`,
      html: buildContactEmailHtml({ name, subject, message }),
    });

    if (!ownerMail.success) {
      console.warn("Contact notification email failed:", ownerMail.error);
    }

    const senderMail = await sendEmail({
      from: `"Md. Shahriyar Rahim" <${senderEmail}>`,
      to: email,
      subject: "Message Received - Thank You!",
      text: `Hi ${name},\n\nThank you for reaching out! I have received your message regarding "${subject}" and will get back to you as soon as possible.\n\nBest regards,\nMd. Shahriyar Rahim`,
      html: buildThankYouEmailHtml({ name, subject }),
    });

    if (!senderMail.success) {
      console.warn("Thank-you email failed:", senderMail.error);
    }

    res.status(201).json({
      success: true,
      message: "Message sent!",
      data: newInbox,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getInbox = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL parameters
    const inbox = await Inbox.findById(id);

    if (!inbox) {
      return res
        .status(404)
        .json({ success: false, message: "Inbox not found" });
    }

    res.status(200).json({
      success: true,
      message: "Inbox fetched successfully",
      data: inbox,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllInbox = async (req, res) => {
  try {
    const inboxes = await Inbox.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Inboxes fetched successfully",
      data: inboxes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const replyInbox = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body; // The message you are sending back

    if (!replyMessage) {
      return res
        .status(400)
        .json({ success: false, message: "Reply content is required" });
    }

    // 1. Find the original message
    const inbox = await Inbox.findById(id);
    if (!inbox) {
      return res
        .status(404)
        .json({ success: false, message: "Inbox not found" });
    }

    // 2. Send the email to the user
    const senderEmail = process.env.SMTP_USER;
    const replyMail = await sendEmail({
      from: `"Md. Shahriyar Rahim" <${senderEmail}>`,
      to: inbox.email, // Use the email from the original document
      subject: `Re: ${inbox.subject}`,
      text: replyMessage,
      html: buildReplyEmailHtml({ recipientName: inbox.name, replyMessage }),
    });

    if (!replyMail.success) {
      console.warn("Inbox reply email failed:", replyMail.error);
    }

    // 3. Update the database record to include the reply
    inbox.reply = replyMessage;
    inbox.repliedAt = new Date();
    inbox.status = "replied"; // Optional: mark as replied
    await inbox.save();

    res.status(200).json({
      success: true,
      message: "Reply sent and saved successfully",
      data: inbox,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

const deleteInbox = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Inbox id is required",
      });
    }

    const inbox = await Inbox.findByIdAndDelete(id);

    if (!inbox) {
      return res.status(404).json({
        success: false,
        message: "Inbox not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inbox deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateInboxStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Inbox id is required",
      });
    }

    const inbox = await Inbox.findById(id);

    if (!inbox) {
      return res.status(404).json({
        success: false,
        message: "Inbox not found",
      });
    }

    inbox.status = req.body.status;

    await inbox.save();

    res.status(200).json({
      success: true,
      message: "Inbox status updated successfully",
      data: inbox,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const inboxController = {
  makeInbox,
  getInbox,
  getAllInbox,
  replyInbox,
  deleteInbox,
  updateInboxStatus,
};

export default inboxController;
