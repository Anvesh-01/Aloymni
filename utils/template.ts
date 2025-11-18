export const createEventInvitationTemplate = (
  title: string,
  description: string,
  timing: string,
  date: string,
  location: string,
  alumniName?: string
) => {
  // Format the date for better display
  const eventDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Information</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <tr>
                        <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
                            <p style="color: #d1d5db; font-size: 16px; margin: 0 0 24px 0;">
                                Dear ${alumniName || 'Alumni'},
                            </p>
                            
                            
                            <div style="margin-bottom: 24px;">
                                <div style="width: 64px; height: 64px; margin: 0 auto 16px; border: 2px solid #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background-color: transparent;">
                                    <div style="width: 32px; height: 32px; background-color: #ffffff; border-radius: 50%;"></div>
                                </div>
                            </div>
                            
                            <p style="color: #d1d5db; font-size: 18px; margin: 0 0 16px 0;">
                                You're invited to:
                            </p>
                            
                             
                            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0 0 16px 0; line-height: 1.2;">
                                ${title}
                            </h1>
                            
    
                            <p style="color: #d1d5db; font-size: 18px; margin: 0; line-height: 1.5; max-width: 400px; margin-left: auto; margin-right: auto;">
                                Join us for an exciting event that brings together our alumni community for networking, learning, and celebration.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px; background-color: #ffffff;">
                            
                          
                            <h2 style="color: #000000; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; text-align: center;">
                                Event Details:
                            </h2>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="48" style="vertical-align: top; padding-right: 16px;">
                                                    <div style="width: 40px; height: 40px; background-color: #000000; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                                        </svg>
                                                    </div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <h3 style="color: #000000; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">📅 Date & Time</h3>
                                                    <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.4;">📅 Date: ${eventDate}</p>
                                                    <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.4;">⏰ Time: ${timing}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="48" style="vertical-align: top; padding-right: 16px;">
                                                    <div style="width: 40px; height: 40px; background-color: #000000; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                            <circle cx="12" cy="10" r="3"></circle>
                                                        </svg>
                                                    </div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <h3 style="color: #000000; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">📍 Location</h3> 
                                                    <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.4;">📍 Location: ${location}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                                <tr>
                                    <td align="center">
                                        <a href="[CTA_LINK]" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 18px; font-weight: 500; text-align: center;">
                                            RSVP Now
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  const text = `Dear ${alumniName || 'Alumni'},

You're invited to: ${title}

Event Details:
📅 Date: ${eventDate}
⏰ Time: ${timing}  
📍 Location: ${location}

About the Event:
${description}

We look forward to seeing you there and catching up on all the wonderful things you've been up to!

Best regards,
Alumni Network Team
AlumniConnect College Network`;

  return {
    subject: `Invitation: ${title}`,
    html,
    text
  };
};