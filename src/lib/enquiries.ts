import { getDb, isE2EMode } from './firebase';

export interface EnquiryDraft {
  name: string;
  email: string;
  phone: string;
  service: string;
  centreId?: string;
  centreName?: string;
  message: string;
  company?: string;
}

export type EnquiryFieldErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'message' | 'form', string>
>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_RE = /^[+0-9][0-9\s-]{6,18}$/;

export const RATE_LIMIT_MS = 10_000;
const RATE_LIMIT_KEY = 'wt:lastEnquiryAt';

export function validateEnquiry(draft: EnquiryDraft): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};

  const name = draft.name.trim();
  if (name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.';

  const email = draft.email.trim();
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email)) errors.email = 'That email address does not look right.';

  const phone = draft.phone.trim();
  if (phone && !PHONE_RE.test(phone)) {
    errors.phone = 'Please enter a valid phone number, or leave it empty.';
  }

  const message = draft.message.trim();
  if (message.length < 10) errors.message = 'Please write at least 10 characters.';
  else if (message.length > 800) errors.message = 'Please keep your message under 800 characters.';

  return errors;
}

export function rateLimitRemaining(now: number = Date.now()): number {
  try {
    const last = Number(window.localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    if (!last) return 0;
    const elapsed = now - last;
    return elapsed >= RATE_LIMIT_MS ? 0 : RATE_LIMIT_MS - elapsed;
  } catch {
    return 0;
  }
}

function markSubmitted(now: number = Date.now()): void {
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, String(now));
  } catch {
    /* storage may be unavailable; the form still works */
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitEnquiry(draft: EnquiryDraft): Promise<void> {
  const errors = validateEnquiry(draft);
  if (Object.keys(errors).length > 0) {
    throw new Error('invalid-enquiry');
  }

  if (draft.company && draft.company.trim().length > 0) {
    // Honeypot filled: pretend success, write nothing.
    await sleep(200);
    return;
  }

  const remaining = rateLimitRemaining();
  if (remaining > 0) {
    throw new Error('rate-limited');
  }

  const payload = {
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    service: draft.service,
    message: draft.message.trim(),
    source: 'website',
  } as Record<string, unknown>;

  if (draft.centreId) payload.centreId = draft.centreId;

  if (isE2EMode) {
    // Slow enough that the pending state is observable in browser tests.
    await sleep(1200);
    markSubmitted();
    return;
  }

  const db = await getDb();
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'enquiries'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  markSubmitted();
}
