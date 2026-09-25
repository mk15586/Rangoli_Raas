import nodemailer from 'nodemailer';
import { TicketPayload } from './ticketSecurity';

interface SendTicketEmailParams {
  ticket: TicketPayload;
  encryptedToken: string;
  qrCodeDataUrl: string;
}

export interface EmailSendResult {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  messageId?: string;
}

/**
 * Builds responsive, festival-themed HTML email for the e-ticket
 */
function buildTicketEmailHtml(params: {
  ticket: TicketPayload;
  qrCodeCidOrDataUrl: string;
  verifyUrl: string;
}): string {
  const { ticket, qrCodeCidOrDataUrl, verifyUrl } = params;
  const eventDate = ticket.eventDate || 'Saturday, 17 October 2026';
  const venue = ticket.venue || 'Maharashtra Mandal, Patna';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pass for Rangilo Raas 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0206; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #fff8ee;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0206; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background: linear-gradient(180deg, #1f0714 0%, #15030d 100%); border-radius: 20px; border: 1px solid #e5ad42; box-shadow: 0 16px 40px rgba(0,0,0,0.7); overflow: hidden;" cellspacing="0" cellpadding="0" border="0">

          <!-- Festival Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #6E1E3A 0%, #3e0b1d 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #e5ad42;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #f4c45b; text-transform: uppercase;">
                ✨ Official Entry Pass & E-Ticket ✨
              </p>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                RANGILO RAAS 2026
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #ffd699; font-weight: 500;">
                The Grandest Dandiya & Garba Mahotsav
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 24px 28px 12px 28px; text-align: center;">
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 9999px; margin: 0 auto;">
                <tr>
                  <td style="padding: 6px 18px; font-size: 13px; font-weight: 700; color: #4ade80;">
                    ✓ PAYMENT CONFIRMED & TICKET ISSUED
                  </td>
                </tr>
              </table>
              <p style="margin: 14px 0 4px 0; font-size: 15px; color: #fef3c7;">
                Namaste <strong>${ticket.customerName}</strong>,
              </p>
              <p style="margin: 0; font-size: 13px; color: #e2d9d2; line-height: 1.5;">
                Your passes for Rangilo Raas 2026 are confirmed. Present the secure encrypted QR code below at the entry gate.
              </p>
            </td>
          </tr>

          <!-- Ticket Pass Body (Inner Card) -->
          <tr>
            <td style="padding: 12px 24px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #240816; border: 1px dashed #e5ad42; border-radius: 16px; overflow: hidden;">

                <!-- Ticket Tier & Ticket ID -->
                <tr>
                  <td style="padding: 20px 20px 14px 20px; background-color: #310b1e; border-bottom: 1px solid #48152e;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: 700; color: #f4c45b; text-transform: uppercase; letter-spacing: 1px; display: block;">
                            Pass Category
                          </span>
                          <span style="font-size: 20px; font-weight: 800; color: #ffffff;">
                            ${ticket.tierName}
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-weight: 600; color: #d1b5a5; display: block;">
                            Ticket ID
                          </span>
                          <span style="font-size: 15px; font-weight: 800; font-family: monospace; color: #f4c45b; background: #13030b; padding: 4px 8px; border-radius: 6px; border: 1px solid #6E1E3A;">
                            ${ticket.ticketId}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- QR Code Box -->
                <tr>
                  <td align="center" style="padding: 24px 20px 16px 20px;">
                    <div style="display: inline-block; background-color: #ffffff; padding: 12px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
                      <img src="${qrCodeCidOrDataUrl}" alt="Encrypted Ticket QR Code" width="180" height="180" style="display: block; width: 180px; height: 180px;" />
                    </div>
                    <p style="margin: 10px 0 0 0; font-size: 11px; color: #fcd34d; font-weight: 600;">
                      🔒 Encrypted Pass Security Token
                    </p>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color: #a89f91;">
                      Scan at gate for express barcode verification
                    </p>
                  </td>
                </tr>

                <!-- Details Grid -->
                <tr>
                  <td style="padding: 10px 24px 24px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 2;">
                      <tr>
                        <td style="color: #c9baa7;">Date:</td>
                        <td align="right" style="font-weight: 700; color: #ffffff;">${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #c9baa7;">Venue:</td>
                        <td align="right" style="font-weight: 700; color: #ffffff;">${venue}</td>
                      </tr>
                      <tr>
                        <td style="color: #c9baa7;">Quantity:</td>
                        <td align="right" style="font-weight: 700; color: #ffffff;">${ticket.quantity} Pass (${ticket.totalAttendees} Attendees)</td>
                      </tr>
                      <tr>
                        <td style="color: #c9baa7;">Mobile:</td>
                        <td align="right" style="font-weight: 700; color: #ffffff;">${ticket.customerPhone}</td>
                      </tr>
                      <tr>
                        <td style="color: #c9baa7;">Amount Paid:</td>
                        <td align="right" style="font-weight: 800; font-size: 16px; color: #f4c45b;">₹${ticket.totalPaid.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #c9baa7;">Payment Reference:</td>
                        <td align="right" style="font-family: monospace; font-size: 11px; color: #93c5fd;">${ticket.paymentId || 'Razorpay Verified'}</td>
                      </tr>
                    </table>

                    <!-- View Online Button -->
                    <div style="margin-top: 18px; text-align: center;">
                      <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #f4c45b 0%, #e59d29 100%); color: #18050e; font-size: 13px; font-weight: 800; padding: 12px 24px; border-radius: 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                        View / Print Pass Online
                      </a>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Guidelines Section -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #17050e; border: 1px solid #3c1221; border-radius: 12px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #f4c45b; text-transform: uppercase;">
                  Important Venue Instructions:
                </h4>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #c4b5a5; line-height: 1.6;">
                  <li>Entry opens at 06:00 PM. Please arrive early to avoid queue delays.</li>
                  <li>Every attendee must carry a valid photo ID (Aadhaar / Voter ID / Driving License).</li>
                  <li>Traditional Dandiya attire is warmly encouraged!</li>
                  <li>Pass is unique and non-transferable once scanned at the turnstile.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d0107; padding: 20px; text-align: center; border-top: 1px solid #2d0b19;">
              <p style="margin: 0; font-size: 11px; color: #877d73;">
                Rangilo Raas Dandiya Mahotsav 2026 • Maharashtra Mandal, Patna
              </p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #5a524a;">
                Payments secured via Razorpay. Powered by secure Gmail delivery.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends the ticket email using Gmail SMTP through Nodemailer.
 */
export async function sendTicketEmail(params: SendTicketEmailParams): Promise<EmailSendResult> {
  const { ticket, encryptedToken, qrCodeDataUrl } = params;

  const senderEmail = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const senderName = process.env.GMAIL_SENDER_NAME || 'Rangilo Raas 2026';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!senderEmail || !appPassword) {
    return {
      success: false,
      error: 'Gmail SMTP is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.',
    };
  }

  const verifyUrl = `${appUrl}/ticket/${ticket.ticketId}?token=${encodeURIComponent(encryptedToken)}`;

  // Extract base64 without prefix for inline attachment
  const base64Qr = qrCodeDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const htmlContent = buildTicketEmailHtml({
    ticket,
    qrCodeCidOrDataUrl: 'cid:ticketqrcode',
    verifyUrl,
  });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: `"${ticket.customerName}" <${ticket.customerEmail}>`,
      subject: `Your Confirmed Entry Pass - Rangilo Raas Dandiya Night 2026 [Ticket: ${ticket.ticketId}]`,
      text: `Namaste ${ticket.customerName}!\n\nYour pass for Rangilo Raas 2026 is confirmed!\nTicket ID: ${ticket.ticketId}\nCategory: ${ticket.tierName}\nPasses: ${ticket.quantity} (${ticket.totalAttendees} attendees)\nVenue: ${ticket.venue || 'Maharashtra Mandal, Patna'}\nDate: ${ticket.eventDate || 'Saturday, 17 October 2026'}\nAmount Paid: INR ${ticket.totalPaid}\n\nView and print your digital pass here: ${verifyUrl}\n\nPlease present this ticket and your ID at the gate.`,
      html: htmlContent,
      attachments: [{
        filename: 'ticket-qr.png',
        content: base64Qr,
        encoding: 'base64',
        cid: 'ticketqrcode',
        contentType: 'image/png',
      }],
    });

    return {
      success: true,
      message: 'Ticket email successfully sent via Gmail.',
      statusCode: 200,
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send ticket email.';
    console.error('Gmail SMTP ticket dispatch failed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
