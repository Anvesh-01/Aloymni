import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendCredentialsEmail(name: string, email: string, uid: string, password: string) {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const mailOptions = {
      from: {
        name: 'Aloymni',
        address: process.env.EMAIL_USER || '',
      },
      to: email,
      subject: 'Your Account Credentials',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
              <h2>Welcome to Our Platform!</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>Your account has been created. Here are your credentials:</p>
              <p><strong>UID:</strong> <code>${uid}</code></p>
              <p><strong>Password:</strong> <code>${password}</code></p>
              <p>Please change your password on first login.</p>
              <hr />
              <small>This is an automated message. Do not reply.</small>
            </div>
          </body>
        </html>
      `,
      text: `Hello ${name}, your UID: ${uid}, Password: ${password}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId?.toString() || '' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// UPDATED function to handle multiple attachments
export async function sendEventInvitationEmail(
  email: string, 
  subject: string, 
  html: string, 
  text: string,
  attachments?: Array<{ filename: string; content: Buffer; contentType: string }> | null // Changed parameter
) {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP connection verified for event invitation');

    const mailOptions: any = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
      text: text,
    };

    // Add multiple attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }));
      console.log(`✅ Added ${attachments.length} attachments to email for ${email}:`, 
        attachments.map(a => a.filename));
    } else {
      console.log(`📧 No attachments for email to ${email}`);
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Event invitation email sent successfully:', info.messageId);
    
    return { success: true, messageId: info.messageId?.toString() || '' };
  } catch (error: any) {
    console.error('Error sending event invitation email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}