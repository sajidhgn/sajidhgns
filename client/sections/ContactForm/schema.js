/**
 * Contact form validation: the same zod rules and error codes as app/api/send-email/route.js, so a visitor
 * gets the same answer before sending as the API would give after. Keep both in sync.
 *
 * Error messages are CODES, exactly like the API's `fields` map:
 *   "required" | "too_short" | "too_long" | "invalid"
 * The form renders them as contact.errors.<field>.<code> (messages/<locale>/contact.json).
 *
 * `website` is the honeypot: never validated here (the API answers a filled honeypot with a fake success).
 */
import { z } from 'zod';

/** The fields the visitor fills in, in DOM order (the API's other optional fields are not used by this form). */
export const FIELDS = ['name', 'email', 'subject', 'message'];

export const LIMITS = { name: 80, email: 254, subject: 120, messageMin: 10, message: 4000 };

/** The visitor-facing error codes (anything else from the API is shown as "invalid"). */
export const ERROR_CODES = new Set(['required', 'too_short', 'too_long', 'invalid']);

// Same rule as the API: no C0 control characters and no DEL.
const hasNoControlChars = (value) => !/[\u0000-\u001f\u007f]/.test(value);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'required')
    .max(LIMITS.name, 'too_long')
    .refine(hasNoControlChars, 'invalid'),
  email: z
    .string()
    .trim()
    .min(1, 'required')
    .max(LIMITS.email, 'too_long')
    .email('invalid'),
  // Optional: an empty string means "no subject". No control characters, so no line breaks either.
  subject: z
    .string()
    .trim()
    .max(LIMITS.subject, 'too_long')
    .refine(hasNoControlChars, 'invalid'),
  message: z
    .string()
    .trim()
    .min(1, 'required')
    .min(LIMITS.messageMin, 'too_short')
    .max(LIMITS.message, 'too_long'),
  website: z.string().optional(),
});
