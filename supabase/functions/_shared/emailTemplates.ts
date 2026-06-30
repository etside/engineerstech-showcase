// Email template helpers for transactional emails
// Used by send-email function to render HTML/text templates

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function verificationEmail(verificationLink: string, userName: string = "User"): EmailTemplate {
  return {
    subject: "Verify your geoListed account",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to geoListed, ${userName}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">Or copy this link: ${verificationLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">If you didn't create this account, you can safely ignore this email.</p>
      </div>
    `,
    text: `Welcome to geoListed, ${userName}!\n\nVerify your email by visiting: ${verificationLink}\n\nIf you didn't create this account, ignore this email.`,
  };
}

export function passwordResetEmail(resetLink: string, userName: string = "User"): EmailTemplate {
  return {
    subject: "Reset your geoListed password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">Copy link if button doesn't work: ${resetLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">If you didn't request a password reset, please ignore this email. Your account is secure.</p>
      </div>
    `,
    text: `Password Reset Request\n\nReset your password: ${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
  };
}

export function businessClaimApprovedEmail(businessName: string, dashboardLink: string): EmailTemplate {
  return {
    subject: `Your listing "${businessName}" is now live on geoListed!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎉 Listing Approved!</h2>
        <p>Great news! Your business listing for <strong>${businessName}</strong> has been verified and is now live.</p>
        <p>Your profile is discoverable by ChatGPT, Claude, DeepSeek, and Qwen when they answer recommendations.</p>
        <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View Dashboard</a>
        <p style="margin-top: 24px; color: #666;">Next steps:</p>
        <ul style="color: #666;">
          <li>Complete your profile with portfolio items and case studies</li>
          <li>Respond to reviews promptly (boosts GEO score)</li>
          <li>Track LLM discovery analytics in your dashboard</li>
        </ul>
      </div>
    `,
    text: `Your listing "${businessName}" is now live!\n\nYour profile is discoverable by ChatGPT, Claude, DeepSeek, and Qwen.\n\nView Dashboard: ${dashboardLink}`,
  };
}

export function reviewNotificationEmail(businessName: string, reviewerName: string, rating: number, reviewLink: string): EmailTemplate {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return {
    subject: `New ${rating}-star review for ${businessName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>📝 New Review</h2>
        <p><strong>${reviewerName}</strong> left a ${rating}-star review:</p>
        <div style="font-size: 24px; letter-spacing: 4px; margin: 16px 0;">${stars}</div>
        <a href="${reviewLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Read Review & Reply</a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">Responding to reviews boosts your GEO score and builds trust.</p>
      </div>
    `,
    text: `New ${rating}-star review for ${businessName}\n\nRead and reply: ${reviewLink}`,
  };
}

export function subscriptionRenewalEmail(businessName: string, tier: string, renewalDate: string): EmailTemplate {
  return {
    subject: `Subscription renewal reminder for ${businessName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Renewal Reminder</h2>
        <p>Your <strong>${tier}</strong> subscription for <strong>${businessName}</strong> will renew on <strong>${renewalDate}</strong>.</p>
        <p>To manage your subscription, visit your dashboard.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">You're subscribed to renewal reminders. Unsubscribe from your account settings.</p>
      </div>
    `,
    text: `Your ${tier} subscription will renew on ${renewalDate}.\n\nVisit your dashboard to manage subscriptions.`,
  };
}

export default {
  verificationEmail,
  passwordResetEmail,
  businessClaimApprovedEmail,
  reviewNotificationEmail,
  subscriptionRenewalEmail,
};
