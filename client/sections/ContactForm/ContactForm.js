'use client';

/**
 * ContactForm — the form inside the contact card (SPEC §4.7, reference crop g_contact.jpg). Client island.
 *
 * export default function ContactForm({ locale })
 *   locale  "en" | "ar" — sent to the API as the visitor's site language
 *
 * Fields: Name | Email, Subject (optional), Message — real <label>s that float: at rest each label sits
 * exactly where the reference shows its placeholder text, on focus / when filled it moves up and shrinks
 * (pure CSS with :placeholder-shown, so it works before hydration too). Plus a hidden honeypot "website".
 *
 * Validation: react-hook-form + zod (./schema.js mirrors app/api/send-email/route.js). Errors show under each
 * field (aria-invalid + aria-describedby) and the first invalid field gets focus.
 * POST /api/send-email (JSON). One polite live region under the button reports the outcome: success ·
 * fields to fix (client-side or the API's `fields` map) · rate_limited · not_configured ("Email me directly
 * at …" — a mailto link that pre-fills the visitor's message, which also stays in the form) · send_failed
 * or any other error · network errors. While sending, the button is aria-disabled (it keeps focus) and shows
 * a spinner. Messages: contact.* (client namespace).
 */
import { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { site } from '../../../content/site';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import { contactSchema, ERROR_CODES, FIELDS } from './schema';
import styles from './ContactForm.module.scss';

const ENDPOINT = '/api/send-email';
const TIMEOUT_MS = 45_000; // the API's SMTP timeouts add up to ≈ 40s
const MAILTO_MAX = 1800; // longer mailto: URLs are unreliable in some mail apps → then only the subject is pre-filled
const DEFAULT_VALUES = { name: '', email: '', subject: '', message: '', website: '' };

/** mailto: link for the "email me directly" fallbacks, pre-filled with what the visitor already wrote. */
function buildMailto(values, fallbackSubject) {
  const subject = values?.subject?.trim() || fallbackSubject;
  const base = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  const message = values?.message?.trim();
  if (!message) return { href: base, prefilled: false };
  const name = values?.name?.trim();
  const href = `${base}&body=${encodeURIComponent(name ? `${message}\n\n— ${name}` : message)}`;
  return href.length <= MAILTO_MAX ? { href, prefilled: true } : { href: base, prefilled: false };
}

export default function ContactForm({ locale }) {
  const t = useTranslations('contact');
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const busy = useRef(false);
  const [status, setStatus] = useState({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  // "Please fix the highlighted fields" goes away once every field is valid again.
  const errorCount = Object.keys(errors).length;
  useEffect(() => {
    if (status.kind === 'invalid' && errorCount === 0) setStatus({ kind: 'idle' });
  }, [status.kind, errorCount]);

  const sending = status.kind === 'sending';

  // Free-text fields follow the direction of what is typed (dir="auto": an English message on the Arabic page
  // reads left-to-right). While empty they inherit the page direction — Chrome resolves an empty dir="auto"
  // field as LTR, which would put the Arabic caret on the wrong side.
  const [nameValue, subjectValue, messageValue] = watch(['name', 'subject', 'message']);
  const autoDir = (value) => (value ? 'auto' : undefined);

  const onValid = async (values) => {
    if (busy.current) return;
    busy.current = true;
    setStatus({ kind: 'sending' });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, locale }),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timer);
      busy.current = false;
      setStatus({ kind: error?.name === 'AbortError' ? 'error' : 'network', values });
      return;
    }
    clearTimeout(timer);

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Not JSON (e.g. a proxy error page): handled as a generic error below.
    }
    busy.current = false;

    if (response.ok && data?.success) {
      reset(DEFAULT_VALUES);
      setStatus({ kind: 'success' });
      return;
    }

    if (data?.code === 'validation_error' && data.fields && typeof data.fields === 'object') {
      const invalid = FIELDS.filter((field) => data.fields[field]);
      invalid.forEach((field) => {
        const code = ERROR_CODES.has(data.fields[field]) ? data.fields[field] : 'invalid';
        setError(field, { type: 'server', message: code });
      });
      if (invalid.length > 0) {
        setFocus(invalid[0]);
        setStatus({ kind: 'invalid' });
        return;
      }
    }

    if (response.status === 429 || data?.code === 'rate_limited') {
      setStatus({ kind: 'rate_limited', values });
    } else if (data?.code === 'not_configured') {
      setStatus({ kind: 'not_configured', values });
    } else {
      setStatus({ kind: 'error', values });
    }
  };

  const onInvalid = () => setStatus({ kind: 'invalid' });

  const errorText = (name) => {
    const code = errors[name]?.message;
    if (!code) return null;
    const key = `errors.${name}.${code}`;
    return t.has(key) ? t(key) : t('errors.generic');
  };

  // One floating-label field. The label comes after its control so CSS can float it with `:focus + label`.
  const field = (name, { type = 'text', multiline = false, className, required = false, ...control } = {}) => {
    const message = errorText(name);
    const Control = multiline ? 'textarea' : 'input';
    return (
      <div className={cx(styles.group, className, message && styles.invalid)}>
        <div className={cx(styles.box, multiline && styles.boxMultiline)}>
          <Control
            id={id(name)}
            className={styles.control}
            placeholder=" "
            required={required}
            aria-invalid={message ? 'true' : undefined}
            aria-describedby={message ? id(`${name}-error`) : undefined}
            {...(multiline ? { rows: 3 } : { type })}
            {...control}
            {...register(name)}
          />
          <label htmlFor={id(name)} className={styles.label}>
            {t(`form.${name}`)}
          </label>
        </div>
        {message ? (
          <p id={id(`${name}-error`)} className={styles.error}>
            {message}
          </p>
        ) : null}
      </div>
    );
  };

  const mailLink = (values) => {
    const { href, prefilled } = buildMailto(values, t('status.mailSubject'));
    const link = (chunks) => (
      <a className={styles.statusLink} href={href} title={site.email}>
        <bdi dir="ltr">{chunks}</bdi>
      </a>
    );
    return { link, prefilled };
  };

  let statusContent = null;
  if (status.kind === 'success') {
    statusContent = (
      <>
        <Icon name="check-circle" size={16} className={styles.statusIcon} />
        <span>{t('status.success')}</span>
      </>
    );
  } else if (status.kind === 'invalid') {
    statusContent = <span>{t('status.invalid')}</span>;
  } else if (status.kind === 'not_configured') {
    const { link, prefilled } = mailLink(status.values);
    statusContent = (
      <>
        <Icon name="mail" size={16} className={styles.statusIcon} />
        <span>{t.rich(prefilled ? 'status.notConfigured' : 'status.notConfiguredLong', { email: site.email, link })}</span>
      </>
    );
  } else if (status.kind === 'rate_limited' || status.kind === 'error') {
    const { link } = mailLink(status.values);
    statusContent = (
      <>
        <Icon name={status.kind === 'rate_limited' ? 'clock' : 'x'} size={16} className={styles.statusIcon} />
        <span>{t.rich(status.kind === 'rate_limited' ? 'status.rateLimited' : 'status.error', { email: site.email, link })}</span>
      </>
    );
  } else if (status.kind === 'network') {
    statusContent = (
      <>
        <Icon name="globe" size={16} className={styles.statusIcon} />
        <span>{t('status.network')}</span>
      </>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onValid, onInvalid)}
      noValidate
      aria-label={t('form.label')}
      aria-busy={sending ? 'true' : undefined}
    >
      {/* No maxLength: silent truncation would hide the "too long" explanation; the schema checks lengths. */}
      {field('name', { required: true, autoComplete: 'name', dir: autoDir(nameValue) })}
      {field('email', {
        type: 'email',
        required: true,
        autoComplete: 'email',
        autoCapitalize: 'off',
        inputMode: 'email',
        spellCheck: false,
        dir: 'ltr',
        className: styles.email,
      })}
      {field('subject', { className: cx(styles.wide, styles.subject), dir: autoDir(subjectValue) })}
      {field('message', { multiline: true, required: true, className: styles.wide, dir: autoDir(messageValue) })}

      {/* Honeypot: hidden from people and assistive tech; bots that fill it get a fake success from the API. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={id('website')}>{t('form.honeypot')}</label>
        <input
          id={id('website')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore=""
          data-lpignore="true"
          {...register('website')}
        />
      </div>

      <div className={styles.footer}>
        <Button type="submit" variant="outline" className={styles.submit} aria-disabled={sending ? 'true' : undefined}>
          <span className={styles.submitLabels}>
            <span className={cx(styles.submitText, sending && styles.isHidden)}>{t('form.submit')}</span>
            <span className={cx(styles.submitText, !sending && styles.isHidden)}>{t('form.sending')}</span>
          </span>
          {sending ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            <Icon name="send" size={18} className={styles.submitIcon} />
          )}
        </Button>
        <div className={styles.status} data-kind={status.kind} role="status" aria-live="polite" aria-atomic="true">
          {statusContent}
        </div>
      </div>
    </form>
  );
}
