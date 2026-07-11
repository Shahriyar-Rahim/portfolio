import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

const createEmailTemplate = ({
  title,
  previewText,
  greeting,
  intro,
  bodyLines = [],
  ctaText,
  ctaLink,
  footerText,
}) => {
  const bodyMarkup = bodyLines
    .map(
      (line) =>
        `<p style="margin: 0 0 10px; font-size: 15px; line-height: 1.6; color: #334155;">${line}</p>`,
    )
    .join("");

  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#f8fafc; padding:32px 16px; color:#0f172a;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 16px 40px rgba(15,23,42,0.08);">
        <div style="background:linear-gradient(135deg,#111827 0%,#334155 100%); padding:24px 28px;">
          <p style="margin:0; font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#facc15;">Portfolio contact</p>
          <h2 style="margin:10px 0 0; font-size:24px; color:#ffffff;">${title}</h2>
          <p style="margin:8px 0 0; font-size:14px; color:#e2e8f0;">${previewText}</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 12px; font-size:15px; color:#334155;">${greeting}</p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#475569;">${intro}</p>
          ${bodyMarkup}
          ${ctaText && ctaLink ? `<div style="margin:24px 0 8px;"><a href="${ctaLink}" style="display:inline-block; background:#f59e0b; color:#111827; text-decoration:none; padding:12px 18px; border-radius:999px; font-weight:600;">${ctaText}</a></div>` : ""}
        </div>
        <div style="padding:0 28px 28px; border-top:1px solid #e2e8f0;">
          <p style="margin:14px 0 0; font-size:13px; color:#64748b;">${footerText}</p>
        </div>
      </div>
    </div>
  `;
};

export const buildContactEmailHtml = ({ name, subject, message }) =>
  createEmailTemplate({
    title: "New portfolio message",
    previewText: `A new message arrived from ${name}`,
    greeting: `Hello,`,
    intro:
      "A visitor has just sent a message through your portfolio contact form.",
    bodyLines: [
      `<strong>From:</strong> ${name}`,
      `<strong>Subject:</strong> ${subject}`,
      `<strong>Message:</strong><br />${message}`,
    ],
    footerText: "This message was sent automatically from your portfolio site.",
  });

export const buildThankYouEmailHtml = ({ name, subject }) =>
  createEmailTemplate({
    title: "Message received",
    previewText: "Thanks for getting in touch",
    greeting: `Hi ${name},`,
    intro:
      "Thanks for reaching out through my portfolio. I have received your message and will respond as soon as I can.",
    bodyLines: [
      `Your topic: <strong>${subject}</strong>`,
      "If you need anything urgent, feel free to reply directly to this email.",
    ],
    ctaText: "View portfolio",
    ctaLink: process.env.FRONTEND_URL || "http://localhost:5173",
    footerText: "Best regards, Md. Shahriyar Rahim",
  });

export const buildTestimonialEmailHtml = ({ clientName, feedback, rating }) =>
  createEmailTemplate({
    title: "New testimonial received",
    previewText: `${clientName} shared feedback for review`,
    greeting: "Hello,",
    intro:
      "A new testimonial has been submitted through your portfolio and is waiting for moderation.",
    bodyLines: [
      `<strong>From:</strong> ${clientName}`,
      `<strong>Rating:</strong> ${rating || "n/a"} / 5`,
      `<strong>Feedback:</strong><br />${feedback}`,
    ],
    footerText:
      "Please review it in the admin dashboard when you have a moment.",
  });

export const buildTestimonialThankYouHtml = ({ clientName }) =>
  createEmailTemplate({
    title: "Thanks for your feedback",
    previewText: "Your testimonial is pending review",
    greeting: `Hi ${clientName},`,
    intro:
      "Thank you for taking the time to share your experience. Your testimonial is currently pending review and will be published after approval.",
    bodyLines: [
      "Your words matter and help future clients understand the experience better.",
      "I will review your feedback soon.",
    ],
    ctaText: "Open portfolio",
    ctaLink: process.env.FRONTEND_URL || "http://localhost:5173",
    footerText: "Best regards, Md. Shahriyar Rahim",
  });

export const buildReplyEmailHtml = ({ recipientName, replyMessage }) =>
  createEmailTemplate({
    title: "Reply from your portfolio contact",
    previewText: "A reply was sent to your message",
    greeting: `Hi ${recipientName || "there"},`,
    intro:
      "A reply has been sent regarding your recent message through the portfolio contact form.",
    bodyLines: [
      `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">${replyMessage.replace(/\n/g, "<br />")}</div>`,
    ],
    footerText: "Thank you for reaching out.",
  });

transporter.verify((error) => {
  if (error) {
    console.error("Transporter configuration error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendMailSafe = async (mailOptions) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured; skipping email delivery.");
    return { success: false, error: "SMTP credentials not configured" };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send failed:", error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;
