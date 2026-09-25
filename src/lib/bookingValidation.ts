export const TICKET_PRICES = {
  regular: 299,
  couple: 599,
  family: 999,
} as const;

export const TICKET_ADMITS = {
  regular: 1,
  couple: 2,
  family: 5,
} as const;

export type BookingValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

export function validateName(name: string): string {
  const value = name.trim();
  if (!value) return 'Full Name is required.';
  if (value.length < 3 || value.length > 80) return 'Name must be between 3 and 80 characters.';
  if (!/^[a-zA-Z][a-zA-Z\s'.-]*$/.test(value)) return 'Name should contain only letters and spaces.';
  return '';
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

export function validateEmail(email: string): string {
  const value = email.trim().toLowerCase();
  if (!value) return 'Email address is required for ticket delivery.';
  if (value.length > 254 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(value)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

export function validatePhone(phone: string): string {
  const value = normalizePhone(phone);
  if (!value) return 'Mobile number is required.';
  if (!/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit Indian mobile number.';
  return '';
}

export function validateBookingDetails(name: string, email: string, phone: string): BookingValidationErrors {
  const errors: BookingValidationErrors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const phoneError = validatePhone(phone);
  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (phoneError) errors.phone = phoneError;
  return errors;
}

export function isTicketTier(value: unknown): value is keyof typeof TICKET_PRICES {
  return typeof value === 'string' && value in TICKET_PRICES;
}

export function parseQuantity(value: unknown): number | null {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 10 ? quantity : null;
}
