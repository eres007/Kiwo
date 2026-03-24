// Email Service
// Sends transactional emails to users
// Using Resend (free tier available) or console logging for development

import { logger } from '../utils/logger.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Resend lazily
let resend = null;
let resendInitialized = false;

async function initializeResend() {
  if (resendInitialized) return resend;
  
  try {
    if (RESEND_API_KEY) {
      const { Resend } = await import('resend');
      resend = new Resend(RESEND_API_KEY);
      logger.info('Resend initialized successfully');
    }
  } catch (error) {
    logger.warn('Resend SDK not available', { error: error.message });
  }
  
  resendInitialized = true;
  return resend;
}

// Send welcome email to new user
export async function sendWelcomeEmail(email, name, tempPassword) {
  try {
    const subject = 'Welcome to Kiwo - Your AI Memory Layer';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Kiwo, ${name}!</h1>
        
        <p style="color: #666; font-size: 16px;">
          Your account has been created successfully. Here are your login credentials:
        </p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0 0 0; color: #333;"><strong>Temporary Password:</strong> TempPassword123!</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Next Steps:</strong>
        </p>
        <ol style="color: #666; font-size: 14px;">
          <li>Log in to your account at https://kiwo.vercel.app</li>
          <li>Change your password to something secure</li>
          <li>Connect your AI tools (Cursor, Claude Code, ChatGPT, etc.)</li>
          <li>Start capturing memories and never re-explain your project again</li>
        </ol>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Questions? Check out our <a href="https://kiwo.vercel.app" style="color: #0066cc;">documentation</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          © 2026 Kiwo. All rights reserved.
        </p>
      </div>
    `;

    if (NODE_ENV === 'production' && RESEND_API_KEY) {
      // Initialize Resend and send
      const resendClient = await initializeResend();
      if (resendClient) {
        return await sendViaResend(resendClient, email, subject, htmlContent);
      } else {
        logger.warn('Resend not available, logging email instead', { to: email });
        logger.info('Welcome email (fallback mode)', { to: email, subject });
        return { success: true, message: 'Email logged (Resend not available)' };
      }
    } else {
      // Log to console in development
      logger.info('Welcome email (development mode)', {
        to: email,
        subject,
      });
      return { success: true, message: 'Email logged to console (development mode)' };
    }
  } catch (error) {
    logger.error('Failed to send welcome email', { error: error.message, email });
    return { success: false, error: error.message };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetLink = `https://kiwo.vercel.app/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Kiwo Password';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset Your Password</h1>
        
        <p style="color: #666; font-size: 16px;">
          We received a request to reset your password. Click the link below to proceed:
        </p>
        
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Or copy this link: <a href="${resetLink}" style="color: #0066cc;">${resetLink}</a>
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link expires in 24 hours. If you didn't request this, ignore this email.
        </p>
      </div>
    `;

    if (NODE_ENV === 'production' && RESEND_API_KEY) {
      const resendClient = await initializeResend();
      if (resendClient) {
        return await sendViaResend(resendClient, email, subject, htmlContent);
      }
    }
    
    logger.info('Password reset email (fallback mode)', { to: email, subject });
    return { success: true, message: 'Email logged (Resend not available)' };
  } catch (error) {
    logger.error('Failed to send password reset email', { error: error.message, email });
    return { success: false, error: error.message };
  }
}

// Send memory notification email
export async function sendMemoryNotificationEmail(email, memoryCount) {
  try {
    const subject = `You have ${memoryCount} memories saved in Kiwo`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Memories Are Growing!</h1>
        
        <p style="color: #666; font-size: 16px;">
          You now have <strong>${memoryCount} memories</strong> saved in Kiwo. 
          Your AI tools are getting smarter with every interaction.
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <a href="https://kiwo.vercel.app/dashboard" style="color: #0066cc;">View your memories</a>
        </p>
      </div>
    `;

    if (NODE_ENV === 'production' && RESEND_API_KEY) {
      const resendClient = await initializeResend();
      if (resendClient) {
        return await sendViaResend(resendClient, email, subject, htmlContent);
      }
    }
    
    logger.info('Memory notification email (fallback mode)', { to: email, subject });
    return { success: true, message: 'Email logged (Resend not available)' };
  } catch (error) {
    logger.error('Failed to send memory notification email', { error: error.message, email });
    return { success: false, error: error.message };
  }
}

// Internal function to send via Resend API
async function sendViaResend(resendClient, to, subject, html) {
  try {
    if (!resendClient) {
      logger.warn('Resend client not available');
      return { success: false, error: 'Resend client not available' };
    }

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (result.error) {
      logger.error('Resend API error', { error: result.error });
      throw new Error(result.error.message || 'Failed to send email via Resend');
    }

    logger.info('Email sent via Resend', { to, subject, messageId: result.data?.id });
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    logger.error('Resend send error', { error: error.message });
    throw error;
  }
}

export default {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendMemoryNotificationEmail,
};
