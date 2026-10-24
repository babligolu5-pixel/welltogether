import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '../data/site';
import { submitEnquiry, validateEnquiry, type EnquiryDraft } from '../lib/enquiries';
import type { EnquiryTarget } from './Header';

interface Props {
  open: boolean;
  target: EnquiryTarget;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  message: '',
  company: '',
};

export default function EnquiryDialog({ open, target, onClose }: Props) {
  const [values, setValues] = useState(EMPTY);
  const [service, setService] = useState(target.service ?? SERVICES[0].name);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setService(target.service ?? SERVICES[0].name);
    setErrors({});
    setFormError('');
    setStatus('idle');
    const timer = window.setTimeout(() => nameRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open, target.service]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof typeof EMPTY, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const draft: EnquiryDraft = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      service,
      message: values.message,
      company: values.company,
    };
    if (target.centreId) draft.centreId = target.centreId;

    const fieldErrors = validateEnquiry(draft);
    setErrors(fieldErrors as Record<string, string>);
    if (Object.keys(fieldErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    setFormError('');
    try {
      await submitEnquiry(draft);
      setStatus('success');
      setValues(EMPTY);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      setStatus('error');
      if (message === 'rate-limited') {
        setFormError('Please wait a few seconds before sending another enquiry.');
      } else if (message === 'firebase-not-configured') {
        setFormError(
          'Enquiries are not connected to the server yet. Please try again later.',
        );
      } else {
        setFormError('We could not send your enquiry just now. Please try again.');
      }
    }
  };

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        ref={cardRef}
        data-testid="enquiry-dialog"
      >
        <button
          type="button"
          className="dialog-close"
          aria-label="Close enquiry form"
          data-testid="enquiry-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="enquiry-title">Send a wellness enquiry</h2>
        <p className="dialog-sub">
          {target.centreName
            ? `About ${target.centreName}. One short message — the centre replies directly.`
            : 'Tell us what you are looking for. One short message, no account needed.'}
        </p>

        {status === 'success' ? (
          <div
            className="form-success"
            role="status"
            data-testid="enquiry-success"
          >
            <strong>Thank you.</strong> Your enquiry has been noted. A centre
            coordinator will reply by email.
            <div className="form-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate data-testid="enquiry-form">
            <div className="form-grid">
              <div className="form-row">
                <div className="field">
                  <label htmlFor="enquiry-name">Name</label>
                  <input
                    id="enquiry-name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => set('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                    ref={nameRef}
                    data-testid="enquiry-name"
                  />
                  {errors.name && (
                    <p className="field-error" id="enquiry-name-error" data-testid="error-name">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="enquiry-email">Email</label>
                  <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => set('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                    data-testid="enquiry-email"
                  />
                  {errors.email && (
                    <p className="field-error" id="enquiry-email-error" data-testid="error-email">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="enquiry-phone">
                  Phone <span className="hint">(optional)</span>
                </label>
                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => set('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
                  data-testid="enquiry-phone"
                />
                {errors.phone && (
                  <p className="field-error" id="enquiry-phone-error">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="enquiry-service">Service</label>
                <select
                  id="enquiry-service"
                  name="service"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  data-testid="enquiry-service"
                >
                  {SERVICES.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="enquiry-message">Message</label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  value={values.message}
                  onChange={(event) => set('message', event.target.value)}
                  placeholder="What are you hoping for? Dates, city, anything helpful."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
                  data-testid="enquiry-message"
                />
                {errors.message && (
                  <p className="field-error" id="enquiry-message-error" data-testid="error-message">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="hp-field" aria-hidden="true">
                <label htmlFor="enquiry-company">Company</label>
                <input
                  id="enquiry-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={(event) => set('company', event.target.value)}
                />
              </div>

              {formError && (
                <p className="form-alert" role="alert" data-testid="enquiry-error">
                  {formError}
                </p>
              )}
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'submitting'}
                data-testid="enquiry-submit"
              >
                {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
              </button>
              <span className="form-footnote">
                No spam, no account. Your details are used only to answer this enquiry.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
