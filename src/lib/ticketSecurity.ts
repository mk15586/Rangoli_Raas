import crypto from 'crypto';

const SECRET = process.env.TICKET_ENCRYPTION_SECRET;

// Derive a 32-byte key from the secret
function getEncryptionKey(): Buffer {
  if (!SECRET) {
    throw new Error('TICKET_ENCRYPTION_SECRET is not configured on the server.');
  }
  return crypto.createHash('sha256').update(SECRET).digest();
}

export interface TicketPayload {
  ticketId: string;
  orderId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tierId: string;
  tierName: string;
  quantity: number;
  totalAttendees: number;
  totalPaid: number;
  issuedAt: number;
  eventDate?: string;
  venue?: string;
}

/**
 * Encrypts ticket payload with authenticated encryption.
 */
export function encryptTicketPayload(payload: TicketPayload): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const jsonString = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(jsonString, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `RR27_${Buffer.from(`${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`).toString('base64url')}`;
}

/**
 * Decrypts and verifies the tamper-proof ticket token
 */
export function decryptTicketToken(token: string): TicketPayload | null {
  try {
    if (!token.startsWith('RR27_') && !token.startsWith('RR26_')) {
      return null;
    }

    const key = getEncryptionKey();
    const base64Data = token.slice(5);
    const decoded = Buffer.from(base64Data, 'base64url').toString('utf8');
    const parts = decoded.split(':');

    if (token.startsWith('RR27_')) {
      if (parts.length !== 3) return null;
      const [ivHex, authTagHex, encryptedHex] = parts;
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
      decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, 'hex')),
        decipher.final(),
      ]).toString('utf8');
      return JSON.parse(decrypted) as TicketPayload;
    }

    if (parts.length !== 3) return null;
    const [ivHex, encryptedHex, signature] = parts;
    const tokenRaw = `${ivHex}:${encryptedHex}`;
    const expectedSignature = crypto.createHmac('sha256', key).update(tokenRaw).digest('hex').substring(0, 16);
    if (signature !== expectedSignature) return null;

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted) as TicketPayload;
  } catch {
    return null;
  }
}

/**
 * Generates human-friendly ticket ID: DN26-XXXX-XXXX
 */
export function generateTicketId(): string {
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestampPart = Date.now().toString(36).slice(-4).toUpperCase();
  return `DN26-${randomChars.slice(0, 4)}-${timestampPart}`;
}
