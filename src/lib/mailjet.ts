import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character);
}

function getGateEntry(ticket: TicketPayload): string {
  return ticket.tierId === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)';
}

function buildTicketEmailHtml(params: {
  ticket: TicketPayload;
  qrCodeCidOrDataUrl: string;
  verifyUrl: string;
}): string {
  const { ticket, qrCodeCidOrDataUrl, verifyUrl } = params;
  const eventDate = escapeHtml(ticket.eventDate || 'Saturday, 17 October 2026');
  const venue = escapeHtml(ticket.venue || 'Maharashtra Mandal, Patna');
  const customerName = escapeHtml(ticket.customerName);
  const tierName = escapeHtml(ticket.tierName);
  const ticketId = escapeHtml(ticket.ticketId);
  const paymentId = escapeHtml(ticket.paymentId);
  const customerPhone = escapeHtml(ticket.customerPhone);
  const gateEntry = escapeHtml(getGateEntry(ticket));
  const safeVerifyUrl = escapeHtml(verifyUrl);
  const amountPaid = `INR ${ticket.totalPaid.toLocaleString('en-IN')}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment confirmed | Rangilo Raas 2026</title>
</head>
<body style="margin:0;padding:0;background:#f3f1ed;font-family:Arial,Helvetica,sans-serif;color:#26221f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f1ed;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #ded9d1;">
          <tr>
            <td style="padding:30px 32px;background:#451629;border-bottom:4px solid #c69a46;">
              <p style="margin:0 0 8px;color:#e5c98d;font-size:11px;font-weight:700;letter-spacing:2px;">RANGILO RAAS 2026</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.3;font-weight:700;">Payment confirmed</h1>
              <p style="margin:8px 0 0;color:#f2e9e5;font-size:14px;line-height:1.5;">Your admission pass is ready.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 18px;">
              <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">Hello ${customerName},</p>
              <p style="margin:0;color:#5e5852;font-size:14px;line-height:1.7;">Thank you for your booking. Your payment has been received and your ticket is attached as a print-ready PDF. Please present the QR code at the venue entrance along with a valid photo ID.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 26px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e2ddd5;">
                <tr><td style="padding:14px 16px;background:#f7f5f1;border-bottom:1px solid #e2ddd5;font-size:12px;color:#625951;">Ticket ID <strong style="color:#451629;">${ticketId}</strong></td></tr>
                <tr><td style="padding:14px 16px;font-size:13px;line-height:1.8;color:#3d3833;">${tierName} &nbsp;|&nbsp; ${ticket.quantity} pass(es), ${ticket.totalAttendees} attendee(s)<br>${eventDate}<br>${venue}<br>Entry: ${gateEntry}<br>Amount paid: <strong>${escapeHtml(amountPaid)}</strong></td></tr>
              </table>
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:22px auto 0;">
                <tr>
                  <td align="center" style="padding:12px;background:#ffffff;border:1px solid #e2ddd5;">
                    <img src="${qrCodeCidOrDataUrl}" alt="Ticket entry QR code" width="150" height="150" style="display:block;width:150px;height:150px;">
                    <p style="margin:10px 0 0;color:#625951;font-size:11px;">Ticket entry QR code</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:24px auto 0;">
                <tr><td align="center" style="background:#451629;"><a href="${safeVerifyUrl}" style="display:inline-block;padding:13px 24px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;">View or print ticket online</a></td></tr>
              </table>
              <p style="margin:20px 0 0;text-align:center;color:#77716a;font-size:12px;line-height:1.6;">A copy of your ticket is attached to this email. Keep the QR code private; it is required for entry.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f7f5f1;border-top:1px solid #e2ddd5;color:#716a62;font-size:11px;line-height:1.6;">
              <strong style="color:#3d3833;">Payment reference:</strong> ${paymentId}<br>
              <strong style="color:#3d3833;">Contact:</strong> ${customerPhone}<br>
              Please bring a valid photo ID. For assistance, contact the event organiser.
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;text-align:center;color:#8a837b;font-size:11px;">
              Rangilo Raas 2026 &nbsp;|&nbsp; Maharashtra Mandal, Patna
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

async function buildTicketPdf(ticket: TicketPayload, qrCodeDataUrl: string): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  const page = document.addPage([595.28, 841.89]);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const wine = rgb(0.27, 0.09, 0.16);
  const gold = rgb(0.77, 0.6, 0.27);
  const ink = rgb(0.16, 0.14, 0.13);
  const muted = rgb(0.4, 0.37, 0.34);
  const paper = rgb(0.98, 0.97, 0.94);
  const qrBase64 = qrCodeDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const qrImage = await document.embedPng(Buffer.from(qrBase64, 'base64'));
  const gateEntry = getGateEntry(ticket);
  const eventDate = ticket.eventDate || 'Saturday, 17 October 2026';
  const venue = ticket.venue || 'Maharashtra Mandal, Patna';
  const amountPaid = `INR ${ticket.totalPaid.toLocaleString('en-IN')}`;
  const issuedAt = new Date(ticket.issuedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
  page.drawRectangle({ x: 0, y: height - 156, width, height: 156, color: wine });
  page.drawRectangle({ x: 0, y: height - 160, width, height: 4, color: gold });
  page.drawText('RANGILO RAAS 2026', { x: 42, y: height - 57, size: 12, font: bold, color: gold });
  page.drawText('OFFICIAL ADMISSION PASS', { x: 42, y: height - 99, size: 25, font: bold, color: rgb(1, 1, 1) });
  page.drawText('Payment confirmed', { x: 44, y: height - 126, size: 12, font: regular, color: rgb(0.94, 0.9, 0.87) });
  page.drawText(`TICKET ID  ${ticket.ticketId}`, { x: 42, y: height - 190, size: 13, font: bold, color: wine });
  page.drawText(ticket.tierName, { x: 42, y: height - 218, size: 19, font: bold, color: ink });
  page.drawLine({ start: { x: 42, y: height - 236 }, end: { x: width - 42, y: height - 236 }, thickness: 1, color: gold });

  const drawField = (label: string, value: string, x: number, y: number, maxWidth = 310) => {
    page.drawText(label.toUpperCase(), { x, y, size: 8, font: bold, color: muted });
    const valueSize = Math.min(12, Math.max(7, maxWidth / Math.max(1, regular.widthOfTextAtSize(value, 12)) * 12));
    page.drawText(value, { x, y: y - 17, size: valueSize, font: regular, color: ink, maxWidth });
  };

  drawField('Primary attendee', ticket.customerName, 42, height - 270);
  drawField('Email address', ticket.customerEmail, 42, height - 325);
  drawField('Mobile number', ticket.customerPhone, 42, height - 380);
  drawField('Event date', eventDate, 42, height - 435);
  drawField('Venue', venue, 42, height - 490);
  drawField('Entry gate', gateEntry, 42, height - 545);
  drawField('Admission', `${ticket.quantity} pass(es) / ${ticket.totalAttendees} attendee(s)`, 42, height - 600);
  drawField('Total paid', amountPaid, 42, height - 655);
  drawField('Payment reference', ticket.paymentId, 42, height - 710);
  drawField('Order reference', ticket.orderId, 42, height - 765);

  const qrSize = 148;
  const qrX = width - qrSize - 42;
  const qrY = height - 430;
  page.drawRectangle({ x: qrX - 11, y: qrY - 11, width: qrSize + 22, height: qrSize + 22, color: rgb(1, 1, 1), borderColor: gold, borderWidth: 1.5 });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText('SCAN FOR ENTRY', { x: qrX + 25, y: qrY - 31, size: 9, font: bold, color: wine });
  page.drawText('Keep this QR code private.', { x: qrX - 2, y: qrY - 49, size: 8, font: regular, color: muted });
  page.drawText('Show it at the venue gate.', { x: qrX - 2, y: qrY - 62, size: 8, font: regular, color: muted });

  page.drawRectangle({ x: 0, y: 0, width, height: 42, color: wine });
  page.drawText(`Issued ${issuedAt}  |  Present this pass and a valid photo ID`, {
    x: 42, y: 16, size: 9, font: regular, color: rgb(1, 1, 1),
  });

  return document.save();
}

function buildTicketEmailText(ticket: TicketPayload, verifyUrl: string): string {
  const eventDate = ticket.eventDate || 'Saturday, 17 October 2026';
  const venue = ticket.venue || 'Maharashtra Mandal, Patna';

  return [
    `Hello ${ticket.customerName},`,
    '',
    'Your payment has been received and your Rangilo Raas 2026 admission pass is attached as a PDF.',
    'Please present the QR code at the venue entrance along with a valid photo ID.',
    '',
    `Ticket ID: ${ticket.ticketId}`,
    `Pass type: ${ticket.tierName}`,
    `Admission: ${ticket.quantity} pass(es), ${ticket.totalAttendees} attendee(s)`,
    `Event date: ${eventDate}`,
    `Venue: ${venue}`,
    `Entry gate: ${getGateEntry(ticket)}`,
    `Mobile: ${ticket.customerPhone}`,
    `Amount paid: INR ${ticket.totalPaid.toLocaleString('en-IN')}`,
    `Payment reference: ${ticket.paymentId}`,
    `Order reference: ${ticket.orderId}`,
    '',
    `View or print your pass: ${verifyUrl}`,
    '',
    'Keep the QR code private. It is required for entry.',
    'Rangilo Raas 2026 | Maharashtra Mandal, Patna',
  ].join('\n');
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

  // Attach the QR inline for mail clients and include the complete ticket PDF.
  const base64Qr = qrCodeDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const htmlContent = buildTicketEmailHtml({
    ticket,
    qrCodeCidOrDataUrl: 'cid:ticketqrcode',
    verifyUrl,
  });

  try {
    const ticketPdf = await buildTicketPdf(ticket, qrCodeDataUrl);
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
      subject: `Payment confirmed: Rangilo Raas 2026 ticket ${ticket.ticketId}`,
      text: buildTicketEmailText(ticket, verifyUrl),
      html: htmlContent,
      attachments: [
        {
          filename: `Rangilo-Raas-Ticket-${ticket.ticketId}.pdf`,
          content: Buffer.from(ticketPdf),
          contentType: 'application/pdf',
        },
        {
          filename: 'ticket-qr.png',
          content: base64Qr,
          encoding: 'base64',
          cid: 'ticketqrcode',
          contentType: 'image/png',
        },
      ],
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
