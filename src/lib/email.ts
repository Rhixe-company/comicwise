// ═══════════════════════════════════════════════════
// EMAIL SERVICE - Send Emails with React Email Templates
// ═══════════════════════════════════════════════════

import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import appConfig, { isDevelopment } from "@/appConfig";
import AccountUpdatedEmail from "@/components/emails/AccountUpdatedEmail";
import CommentNotificationEmail from "@/components/emails/CommentNotificationEmail";
import NewChapterEmail from "@/components/emails/NewChapterEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import VerificationEmail from "@/components/emails/VerificationEmail";
import WelcomeEmail from "@/components/emails/WelcomeEmail";

import type { SendEmailOptions } from "@/types";

// ═══════════════════════════════════════════════════
// NODEMAILER TRANSPORTER SETUP
// ═══════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: appConfig.email.host,
  port: appConfig.email.port,
  secure: appConfig.email.secure,
  auth:
    (appConfig.email.auth?.user ?? "") && (appConfig.email.auth?.pass ?? "")
      ? {
          user: appConfig.email.auth?.user ?? "",
          pass: appConfig.email.auth?.pass ?? "",
        }
      : undefined,
});

// Verify transporter configuration
// Avoid verifying the transporter during static build/prerender to prevent
// network calls at module initialization (which can fail in build environments).
// Only verify in development to help catch config issues early.
if ((appConfig.email?.enabled ?? false) && isDevelopment) {
  transporter
    .verify()
    .then(() => {
      console.log("✅ Email server is ready to send messages");
    })
    .catch((error) => {
      console.error("❌ Email transporter verification failed:", error);
    });
}

// ═══════════════════════════════════════════════════
// EMAIL SENDING FUNCTIONS
// ═══════════════════════════════════════════════════

export interface SendEmailParams {
  html: string;
  subject: string;
  text?: string;
  to: string;
}

/**
 * Send email using configured transporter
 * @param root0
 * @param root0.to
 * @param root0.subject
 * @param root0.html
 * @param root0.text
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!(appConfig.email?.enabled ?? false)) {
    console.warn("⚠️ Email feature is disabled. Skipping email send.");
    return { success: false, error: "Email feature is disabled" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.name}" <${appConfig.email.from}>`,
      to,
      subject,
      html,
      text: text || undefined,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// ═══════════════════════════════════════════════════
// TEMPLATE-SPECIFIC EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Send welcome email to new users
 * @param params
 * @param params.name
 * @param params.email
 */
export async function sendWelcomeEmail(params: { email: string; name: string; }) {
  const html = await render(WelcomeEmail({ name: params.name, email: params.email }));

  return sendEmail({
    to: params.email,
    subject: `Welcome to ${appConfig.name}! 🎉`,
    html,
  });
}

/**
 * Send email verification link
 * @param params
 * @param params.name
 * @param params.email
 * @param params.verificationToken
 */
export async function sendVerificationEmail(params: {
  email: string;
  name: string;
  verificationToken: string;
}) {
  const html = await render(
    VerificationEmail({
      name: params.name,
      email: params.email,
      token: params.verificationToken,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Verify your ${appConfig.name} email address`,
    html,
  });
}

/**
 * Send password reset email
 * @param params
 * @param params.name
 * @param params.email
 * @param params.resetToken
 * @param params.ipAddress
 */
export async function sendPasswordResetEmail(params: {
  email: string;
  ipAddress?: string;
  name: string;
  resetToken: string;
}) {
  const html = await render(
    PasswordResetEmail({
      name: params.name,
      email: params.email,
      token: params.resetToken,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Reset your ${appConfig.name} password`,
    html,
  });
}

/**
 * Send account updated notification
 * @param params
 * @param params.name
 * @param params.email
 * @param params.changeType
 * @param params.changeDetails
 * @param params.ipAddress
 */
export async function sendAccountUpdatedEmail(params: {
  changeDetails?: string;
  changeType: "email" | "password" | "profile";
  email: string;
  ipAddress?: string;
  name: string;
}) {
  const html = await render(
    AccountUpdatedEmail({
      userName: params.name,
      userEmail: params.email,
      changeType: params.changeType,
      changeDetails: params.changeDetails,
      ipAddress: params.ipAddress,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Your ${appConfig.name} account has been updated`,
    html,
  });
}

/**
 * Send new chapter notification
 * @param params
 * @param params.userName
 * @param params.userEmail
 * @param params.comicTitle
 * @param params.comicCoverUrl
 * @param params.chapterNumber
 * @param params.chapterTitle
 * @param params.chapterSlug
 * @param params.releaseDate
 */
export async function sendNewChapterEmail(params: {
  chapterNumber: number;
  chapterSlug: string;
  chapterTitle: string;
  comicCoverUrl: string;
  comicTitle: string;
  releaseDate: string;
  userEmail: string;
  userName: string;
}) {
  const chapterUrl = `${appConfig.url}/read/${params.chapterSlug}`;

  const html = await render(
    NewChapterEmail({
      userName: params.userName,
      userEmail: params.userEmail,
      comicTitle: params.comicTitle,
      comicCoverUrl: params.comicCoverUrl,
      chapterNumber: params.chapterNumber,
      chapterTitle: params.chapterTitle,
      chapterUrl,
      releaseDate: params.releaseDate,
    })
  );

  return sendEmail({
    to: params.userEmail,
    subject: `New chapter of ${params.comicTitle} is available!`,
    html,
  });
}

/**
 * Send new chapter notification (simplified)
 * @param params
 * @param params.to
 * @param params.userName
 * @param params.comicTitle
 * @param params.chapterTitle
 * @param params.chapterNumber
 * @param params.chapterUrl
 */
export async function sendNewChapterNotification(params: {
  chapterNumber: number;
  chapterTitle: string;
  chapterUrl: string;
  comicTitle: string;
  to: string;
  userName: string;
}) {
  const html = await render(
    NewChapterEmail({
      userName: params.userName,
      userEmail: params.to,
      comicTitle: params.comicTitle,
      comicCoverUrl: "",
      chapterNumber: params.chapterNumber,
      chapterTitle: params.chapterTitle,
      chapterUrl: params.chapterUrl,
      releaseDate: new Date().toLocaleDateString(),
    })
  );

  return sendEmail({
    to: params.to,
    subject: `New chapter of ${params.comicTitle} is available!`,
    html,
  });
}

/**
 * Send comment notification
 * @param params
 * @param params.userName
 * @param params.userEmail
 * @param params.commenterName
 * @param params.commenterAvatar
 * @param params.commentText
 * @param params.comicTitle
 * @param params.chapterNumber
 * @param params.commentId
 * @param params.commentType
 */
export async function sendCommentNotificationEmail(params: {
  chapterNumber?: number;
  comicTitle: string;
  commenterAvatar?: string;
  commenterName: string;
  commentId: string;
  commentText: string;
  commentType: "mention" | "new" | "reply";
  userEmail: string;
  userName: string;
}) {
  const commentUrl = `${appConfig.url}/comic/${params.comicTitle}comment-${params.commentId}`;

  const html = await render(
    CommentNotificationEmail({
      userName: params.userName,
      userEmail: params.userEmail,
      commenterName: params.commenterName,
      commenterAvatar: params.commenterAvatar,
      commentText: params.commentText,
      comicTitle: params.comicTitle,
      chapterNumber: params.chapterNumber,
      commentUrl,
      commentType: params.commentType,
    })
  );

  const getSubject = () => {
    switch (params.commentType) {
      case "reply":
        return `${params.commenterName} replied to your comment`;
      case "mention":
        return `${params.commenterName} mentioned you in a comment`;
      case "new":
        return `New comment on ${params.comicTitle}`;
      default:
        return "New activity on ComicWise";
    }
  };

  return sendEmail({
    to: params.userEmail,
    subject: getSubject(),
    html,
  });
}

// ═══════════════════════════════════════════════════
// BATCH EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Send email to multiple recipients (for notifications)
 * @param recipients
 * @param emailGenerator
 */
export async function sendBulkEmails(
  recipients: string[],
  emailGenerator: (email: string) => Promise<SendEmailOptions>
) {
  if (!appConfig.features.email) {
    console.warn("⚠️ Email feature is disabled. Skipping bulk email send.");
    return { success: false, error: "Email feature is disabled" };
  }

  const results = await Promise.allSettled(
    recipients.map(async (email) => {
      const emailOptions = await emailGenerator(email);
      // Convert SendEmailOptions to SendEmailParams (single recipient only)
      const recipientEmail = Array.isArray(emailOptions.to) ? emailOptions.to[0] : emailOptions.to;
      if (!recipientEmail) {
        throw new Error("No recipient email provided");
      }
      return sendEmail({
        to: recipientEmail,
        subject: emailOptions.subject,
        html: emailOptions.html,
      });
    })
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`📧 Bulk email results: ${successful} sent, ${failed} failed`);

  return {
    success: failed === 0,
    results: {
      total: recipients.length,
      successful,
      failed,
    },
  };
}

// ═══════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════

export const emailService = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountUpdatedEmail,
  sendNewChapterEmail,
  sendCommentNotificationEmail,
  sendBulkEmails,
};

export default emailService;
